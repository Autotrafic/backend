import {
  autonomousCommunityMap,
  AutonomousCommunityValue,
  SENDCLOUD_SHIP_STATUS,
  TOrderState,
} from '../../interfaces/enums';
import { CreateLabelImport } from '../../interfaces/import/shipment';
import { ExtendedTotalumShipment } from '../../interfaces/totalum/envio';
import { ENVIOS_DRIVE_FOLDER_ID } from '../../utils/constants';
import { getActualDay, getMonthNameInSpanish } from '../../utils/funcs';
import { getDriveFolderIdFromLink } from '../parsers/order';
import { parsePhoneNumberForWhatsApp } from '../parsers/other';
import { parseAddressFromTotalumToRedeable, parseTotalumShipment } from '../parsers/shipment';
import { ensureFolderExists, uploadBase64FileToDrive } from '../services/googleDrive';
import notifySlack, { sendWhatsappMessage } from '../services/notifier';
import { shortUrl } from '../services/other';
import { getSendcloudPdfLabel, requestSendcloudLabel } from '../services/sendcloud';
import { updateTotalumOrderWhenShipped } from '../services/shipments';
import { getExtendedShipmentById } from '../services/totalum';

export async function createSendcloudLabel({ totalumShipment, isTest }: CreateLabelImport): Promise<ParcelResponse> {
  const shipment = parseTotalumShipment(totalumShipment);

  const parcel: ParcelResponseObject = await requestSendcloudLabel(shipment, isTest);

  return parcel.parcel;
}

export async function makeShipment({ totalumShipment, isTest }: CreateLabelImport): Promise<string> {
  try {
    const shipmentReference = totalumShipment.referencia;
    const order = totalumShipment.pedido[0];

    if (order.estado !== TOrderState.PendienteEnvioCliente)
      throw new Error(`${shipmentReference} No está pendiente de envío cliente`);

    const parcel = await createSendcloudLabel({ totalumShipment, isTest });
    const parcelId = parcel.id;

    const trackingNumber = parcel.tracking_number;
    const trackingUrl = await shortUrl(parcel?.tracking_url);

    await updateTotalumOrderWhenShipped(totalumShipment, { trackingNumber, trackingUrl });

    if (parcel.status.id !== SENDCLOUD_SHIP_STATUS.READY_TO_SEND.id) {
      throw new Error(
        `Sendcloud no reconoce el envío de ${shipmentReference} como listo para enviar. Contacta con soporte.`
      );
    }

    const pdfLabelBuffer = await getSendcloudPdfLabel(parcelId);

    const labelBase64 = Buffer.from(pdfLabelBuffer).toString('base64');

    const extendedShipment = await getExtendedShipmentById(totalumShipment._id);
    const shipmentOrders = extendedShipment.pedido;

    const uploadLabelPromises = shipmentOrders.map((order) => {
      const folderId = getDriveFolderIdFromLink(order.documentos);
      return uploadBase64FileToDrive(labelBase64, folderId, 'Etiqueta_envio');
    });

    await Promise.all(uploadLabelPromises);

    if (!isTest) await notifyShipmentClient(totalumShipment);

    return labelBase64;
  } catch (error) {
    throw new Error(`Error making shipment with shipment info. ${error.message}`);
  }
}

export function checkShipmentsData(shipments: ExtendedTotalumShipment[]) {
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

async function notifyShipmentClient(shipmentInfo: ExtendedTotalumShipment) {
  try {
    const message = getShipmentNotifyMessage(shipmentInfo);
    const phoneNumber = parsePhoneNumberForWhatsApp(shipmentInfo.telefono);

    await sendWhatsappMessage({ phoneNumber, message });
  } catch (error) {
    notifySlack(`Error sending shipment notify whatsapp message: ${error}`);
  }
}

function getShipmentNotifyMessage(shipmentInfo: ExtendedTotalumShipment): string {
  const { nombre_cliente, referencia, enlace_seguimiento, pedido } = shipmentInfo;
  const { comunidad_autonoma } = pedido[0];

  const isFastShipment = comunidad_autonoma === autonomousCommunityMap[AutonomousCommunityValue.CATALUNA];
  const address = parseAddressFromTotalumToRedeable(shipmentInfo);

  const message = `👋 Muy buenas, *${nombre_cliente}*

🚚 Le informamos que su nuevo permiso de circulación del vehículo con matrícula *${referencia}* está en camino

🏠 Su destino es ${address}

⏱ Llegará en un plazo de *${isFastShipment ? '3/5' : '5/7'}* días 

🔍 Puedes conocer el estado del envío mediante éste enlace: ${enlace_seguimiento}

☀️ Le deseamos un buen día`;

  return message;
}
