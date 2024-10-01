import { CreateLabelImport } from '../../interfaces/import/shipment';
import { parseTotalumShipment } from '../parsers/shipment';
import { requestSendcloudLabel } from '../services/sendcloud';

export async function createSendcloudLabel({ totalumShipment, isTest }: CreateLabelImport): Promise<ParcelResponse> {
  const shipment = parseTotalumShipment(totalumShipment);

  const parcel: ParcelResponseObject = await requestSendcloudLabel(shipment, isTest);

  return parcel.parcel;
}
