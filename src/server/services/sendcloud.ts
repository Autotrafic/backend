import { Method } from 'axios';
import { makeSendcloudRequest, SendcloudRequestOptions } from '.';
import { createParcelFromShipment } from '../parsers/shipment';

export async function requestSendcloudLabel(shipment: ParsedTotalumShipment, isTest: boolean) {
  const parcel: CreateLabelExportBody = {
    parcel: createParcelFromShipment(shipment, isTest),
    isTest,
  };

  const options: SendcloudRequestOptions = {
    endpoint: 'parcels',
    method: 'post' as Method,
    body: parcel,
  };

  const result = await makeSendcloudRequest(options);

  return result;
}

export async function getSendcloudPdfLabel(parcelId: number): Promise<Buffer> {
  const options: SendcloudRequestOptions = {
    endpoint: `labels/normal_printer/${parcelId}`,
    method: 'get',
    isResponseBuffer: true,
  };

  try {
    const result = await makeSendcloudRequest(options);

    return result;
  } catch (error) {
    throw new Error(
      `Error requesting pdf label to sendcloud. \n Endpoint: ${options.endpoint} \n Method: ${options.endpoint}`
    );
  }
}
