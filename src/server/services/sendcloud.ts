import { Method } from "axios";
import { makeSendcloudRequest } from ".";
import { createParcelFromShipment } from "../parsers/shipment";

let options: { endpoint: string; method: Method; body?: CreateLabelExportBody };

export async function createSendcloudLabel(
  shipment: ParsedTotalumShipment,
  isTest: boolean
) {
  const parcel: CreateLabelExportBody = {
    parcel: createParcelFromShipment(shipment, isTest),
    isTest,
  };

  options = {
    endpoint: "parcels",
    method: "post" as Method,
    body: parcel,
  };

  const result = await makeSendcloudRequest(options);

  return result;
}

export async function getSendcloudPdfLabel(
  parcelId: number,
  startFrom: number
): Promise<File> {
  options = {
    endpoint: `labels/normal_printer/${parcelId}?start_from=${startFrom}`,
    method: "get",
  };

  const result = await makeSendcloudRequest(options);

  return result;
}