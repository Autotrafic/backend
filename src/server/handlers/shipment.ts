import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { TCheck } from '../../interfaces/checks';
import {
  autonomousCommunityMap,
  AutonomousCommunityValue,
  SENDCLOUD_SHIP_STATUSES,
  TOrderState,
} from '../../interfaces/enums';
import { CreateLabelImport } from '../../interfaces/import/shipment';
import { ExtendedTotalumShipment, TotalumShipment } from '../../interfaces/totalum/envio';
import { SHIPMENT_FIELD_CONDITIONS, handleOrdersWithWrongNumberOfShipments, generateChecks } from '../../utils/checks';
import { ENVIOS_DRIVE_FOLDER_ID } from '../../utils/constants';
import { getActualDay, getMonthNameInSpanish, sleep } from '../../utils/funcs';
import { getDriveFolderIdFromLink } from '../parsers/order';
import { parsePhoneNumberForWhatsApp } from '../parsers/other';
import { parseAddressFromTotalumToRedeable, parseTotalumShipment } from '../parsers/shipment';
import { ensureFolderExists, uploadBase64FileToDrive } from '../services/googleDrive';
import notifySlack, { searchRegexInWhatsappChat, sendWhatsappMessage } from '../services/notifier';
import { shortUrl } from '../services/other';
import { getSendcloudPdfLabel, requestSendcloudLabel } from '../services/sendcloud';
import { updateTotalumOrderWhenShipped } from '../services/shipments';
import {
  getExtendedShipmentsByParcelId,
  getOrdersPendingToShip,
  updateOrderById,
  updateShipmentById,
} from '../services/totalum';

type NotifyMessageType = 'sent' | 'pickup';

export async function createPdfAsBase64(text: string): Promise<string> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a blank page
  const page = pdfDoc.addPage([600, 400]);

  // Embed the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Define font size and color
  const fontSize = 24;
  const textColor = rgb(0, 0, 0);

  // Add text to the page
  page.drawText(text, {
    x: 50,
    y: 300,
    size: fontSize,
    font: font,
    color: textColor,
  });

  // Serialize the PDF document to bytes
  const pdfBytes = await pdfDoc.save();

  await sleep(4000);

  // Convert the bytes to a Base64 string
  const labelBase64 = Buffer.from(pdfBytes).toString('base64');

  return labelBase64;
}

export async function checkShipmentsAvailability(): Promise<{ passedChecks: TCheck[]; failedChecks: TCheck[] }> {
  const passedChecks: TCheck[] = [];
  const failedChecks: TCheck[] = [];

  const ordersPendingToShip = await getOrdersPendingToShip();

  const ordersWithoutShipment = ordersPendingToShip.filter((order) => !order.envio || order.envio.length < 1);
  const ordersWithMultipleShipments = ordersPendingToShip.filter((order) => order.envio && order.envio.length > 1);
  const ordersWithOneShipment = ordersPendingToShip.filter((order) => order.envio && order.envio.length === 1);

  handleOrdersWithWrongNumberOfShipments(failedChecks, ordersWithoutShipment, ordersWithMultipleShipments);

  const shipments = ordersWithOneShipment
    .map((order) => order.envio[0])
    .filter((shipment, index, self) => index === self.findIndex((s) => s._id === shipment._id));

  shipments.forEach((shipment) => {
    const { passedChecks: passed, failedChecks: failed } = generateChecks(shipment, SHIPMENT_FIELD_CONDITIONS);
    const withSticker = shipment.con_distintivo === 'Si';

    if (passed.length > 0) {
      passedChecks.push({ reference: shipment.referencia, shipmentId: shipment._id, checks: passed, withSticker });
    }
    if (failed.length > 0) {
      failedChecks.push({ reference: shipment.referencia, shipmentId: shipment._id, checks: failed, withSticker });
    }
  });

  return { passedChecks, failedChecks };
}

export async function createSendcloudLabel({ totalumShipment, isTest }: CreateLabelImport): Promise<ParcelResponse> {
  const shipment = parseTotalumShipment(totalumShipment);

  const parcel: ParcelResponseObject = await requestSendcloudLabel(shipment, isTest);

  return parcel.parcel;
}

export async function makeShipment({ totalumShipment, isTest }: CreateLabelImport): Promise<string> {
  try {
    const shipmentReference = totalumShipment.referencia;

    const parcel = await createSendcloudLabel({ totalumShipment, isTest });

    if (parcel.status.id !== SENDCLOUD_SHIP_STATUSES.READY_TO_SEND.id) {
      throw new Error(
        `Sendcloud no reconoce el envío de ${shipmentReference} como listo para enviar. Contacta con soporte.`
      );
    }

    const parcelId = parcel.id;
    const trackingNumber = parcel.tracking_number;
    const trackingUrl = await shortUrl(parcel?.tracking_url);

    await updateTotalumOrderWhenShipped(totalumShipment, { trackingNumber, trackingUrl, sendcloudParcelId: parcelId });

    const pdfLabelBuffer = await getSendcloudPdfLabel(parcelId);
    const labelBase64 = Buffer.from(pdfLabelBuffer).toString('base64');

    const shipmentOrders = totalumShipment.pedido;

    const uploadLabelPromises = shipmentOrders.map((order) => {
      const folderId = getDriveFolderIdFromLink(order.documentos);
      return uploadBase64FileToDrive(labelBase64, folderId, 'Etiqueta_envio');
    });

    await Promise.all(uploadLabelPromises);

    return labelBase64;
  } catch (error) {
    throw new Error(`Couldn't make shipment of ${totalumShipment.referencia}. ${error.message}`);
  }
}

export function checkEmptyShipments(shipments: ExtendedTotalumShipment[]) {
  try {
    for (let shipment of shipments) {
      if (!shipment?.referencia || !shipment?.pedido) throw new Error(`Éste envío no contiene datos: \n${shipment}`);
    }
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadMergedLabelsToDrive(mergedLabelsBase64: string) {
  const actualMonthName = getMonthNameInSpanish().toUpperCase();
  const actualDayNumber = `${getActualDay()}`;

  const monthFolderId = await ensureFolderExists(actualMonthName, ENVIOS_DRIVE_FOLDER_ID);
  const dayFolderId = await ensureFolderExists(actualDayNumber, monthFolderId);

  await uploadBase64FileToDrive(mergedLabelsBase64, dayFolderId, 'Etiquetas_envio');
}

async function notifyShipmentClient(shipmentInfo: ExtendedTotalumShipment, notifyMessageType: NotifyMessageType) {
  try {
    const message = getShipmentNotifyMessage(shipmentInfo, notifyMessageType);
    const phoneNumber = parsePhoneNumberForWhatsApp(shipmentInfo.telefono);

    const alreadySent = await searchRegexInWhatsappChat(shipmentInfo.telefono, message);

    if (!alreadySent) await sendWhatsappMessage({ phoneNumber, message });
  } catch (error) {
    notifySlack(`Error sending shipment notify whatsapp message: ${error}`);
  }
}

function getShipmentNotifyMessage(shipmentInfo: ExtendedTotalumShipment, type: NotifyMessageType): string {
  const { nombre_cliente, referencia, enlace_seguimiento, pedido } = shipmentInfo;
  const { comunidad_autonoma } = pedido[0];

  const isFastShipment = comunidad_autonoma === autonomousCommunityMap[AutonomousCommunityValue.CATALUNA];
  const address = parseAddressFromTotalumToRedeable(shipmentInfo);

  if (type === 'sent') {
    return `👋 Muy buenas, *${nombre_cliente}*

🚚 Le informamos que su nuevo permiso de circulación del vehículo con matrícula *${referencia}* está en camino

🏠 Su destino es ${address}

⏱ Llegará en un plazo de *${isFastShipment ? '3/5' : '5/7'}* días 

🔍 Puedes conocer el estado del envío mediante éste enlace:
${enlace_seguimiento}

☀️ Le deseamos un buen día`;
  }

  if (type === 'pickup') {
    return `👋 Muy buenas, *${nombre_cliente}*

❌ Se ha hecho un intento de entrega del nuevo permiso de circulación con matrícula *${referencia}*, pero no había nadie en el domicilio

🏤 Ahora se encuentra en la oficina de Correos esperando a ser recogido

🔍 Puedes conocer su estado desde aquí:
${enlace_seguimiento}`;
  }
}

export async function handleParcelUpdate(updatedParcel: ParcelResponse) {
  const parcelId = updatedParcel.id;

  const extendedShipments = await getExtendedShipmentsByParcelId(parcelId);

  for (let shipment of extendedShipments) {
    if (updatedParcel.status.id === SENDCLOUD_SHIP_STATUSES.AT_SORTING_CENTRE.id) {
      await notifyShipmentClient(shipment, 'sent');
    }

    if (updatedParcel.status.id === SENDCLOUD_SHIP_STATUSES.AWAITING_CUSTOMER_PICKUP.id) {
      await notifyShipmentClient(shipment, 'pickup');
    }

    if (updatedParcel.status.id === SENDCLOUD_SHIP_STATUSES.RETURNED_TO_SENDER.id) {
      const update = { referencia: `${shipment.referencia} Cobrar reenvio o pedir nueva direccion` };
      await updateShipmentById(shipment._id, update);
    }

    for (let order of shipment.pedido) {
      if (updatedParcel.status.id === SENDCLOUD_SHIP_STATUSES.AT_SORTING_CENTRE.id) {
        const update = { estado: TOrderState.EnviadoCliente };
        await updateOrderById(order._id, update);
      }

      if (updatedParcel.status.id === SENDCLOUD_SHIP_STATUSES.RETURNED_TO_SENDER.id) {
        const update = { estado: TOrderState.PendienteDevolucionCorreos };
        await updateOrderById(order._id, update);
      }

      if (updatedParcel.status.id === SENDCLOUD_SHIP_STATUSES.DELIVERED.id) {
        const update = { estado: TOrderState.EntregadoCliente };
        await updateOrderById(order._id, update);
      }
    }
  }
}
