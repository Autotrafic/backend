import { SENDCLOUD_SHIP_STATUS } from '../../interfaces/enums';
import { CreateLabelImport } from '../../interfaces/import/shipment';
import { ENVIOS_DRIVE_FOLDER_ID } from '../../utils/constants';
import { getActualDay, getMonthNameInSpanish } from '../../utils/funcs';
import { getDriveFolderIdFromLink } from '../parsers/order';
import { parseTotalumShipment } from '../parsers/shipment';
import { ensureFolderExists, uploadBase64FileToDrive } from '../services/googleDrive';
import { getSendcloudPdfLabel, requestSendcloudLabel } from '../services/sendcloud';
import { updateTotalumOrderWhenShipped } from '../services/shipments';
import { getExtendedShipmentById } from '../services/totalum';

export async function createSendcloudLabel({
  totalumShipment: totalumShipment,
  isTest,
}: CreateLabelImport): Promise<ParcelResponse> {
  const shipment = parseTotalumShipment(totalumShipment);

  const parcel: ParcelResponseObject = await requestSendcloudLabel(shipment, isTest);

  return parcel.parcel;
}

export async function makeShipment(shipmentInfo: CreateLabelImport): Promise<string> {
  try {
    const shipmentReference = shipmentInfo.totalumShipment.referencia;

    const parcel = await createSendcloudLabel(shipmentInfo);
    const parcelId = parcel.id;

    await updateTotalumOrderWhenShipped(shipmentInfo.totalumShipment, parcel);

    if (parcel.status.id !== SENDCLOUD_SHIP_STATUS.READY_TO_SEND.id) {
      throw new Error(
        `Sendcloud no reconoce el envío de ${shipmentReference} como listo para enviar. Contacta con soporte.`
      );
    }

    const pdfLabelBuffer = await getSendcloudPdfLabel(parcelId);

    const labelBase64 = Buffer.from(pdfLabelBuffer).toString('base64');

    const extendedShipment = await getExtendedShipmentById(shipmentInfo.totalumShipment._id);
    const shipmentOrders = extendedShipment.pedido;

    const uploadLabelPromises = shipmentOrders.map((order) => {
      const folderId = getDriveFolderIdFromLink(order.documentos);
      return uploadBase64FileToDrive(labelBase64, folderId);
    });

    await Promise.all(uploadLabelPromises);

    return labelBase64;
  } catch (error) {
    throw new Error(`Error making shipment with shipment info. ${error}`);
  }
}

export async function uploadMergedLabelsToDrive(mergedLabelsBase64: string) {
  const actualMonthName = getMonthNameInSpanish().toUpperCase();
  const actualDayNumber = `${getActualDay()}`;

  const monthFolderId = await ensureFolderExists(actualMonthName, ENVIOS_DRIVE_FOLDER_ID);
  const dayFolderId = await ensureFolderExists(actualDayNumber, monthFolderId);

  await uploadBase64FileToDrive(mergedLabelsBase64, dayFolderId);
}
