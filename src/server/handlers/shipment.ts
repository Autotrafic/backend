import { SENDCLOUD_SHIP_STATUS } from '../../interfaces/enums';
import { CreateLabelImport } from '../../interfaces/import/shipment';
import { parseTotalumShipment } from '../parsers/shipment';
import { getSendcloudPdfLabel, requestSendcloudLabel } from '../services/sendcloud';

export async function createSendcloudLabel({
  totalumShipment: totalumShipment,
  isTest,
}: CreateLabelImport): Promise<ParcelResponse> {
  const shipment = parseTotalumShipment(totalumShipment);

  const parcel: ParcelResponseObject = await requestSendcloudLabel(shipment, isTest);

  return parcel.parcel;
}

export async function makeShipment(shipmentInfo: CreateLabelImport): Promise<string> {
  const shipmentReference = shipmentInfo.totalumShipment.referencia;
  
  const parcel = await createSendcloudLabel(shipmentInfo);

  const parcelId = parcel.id;

  if (parcel.status.id !== SENDCLOUD_SHIP_STATUS.READY_TO_SEND.id) {
    throw new Error(`Sendcloud no reconoce el envío de ${shipmentReference} como listo para enviar. Contacta con soporte.`);
  }


  const pdfLabelBuffer = await getSendcloudPdfLabel(parcelId);


  const labelBase64 = Buffer.from(pdfLabelBuffer).toString('base64');


  return labelBase64;
}
