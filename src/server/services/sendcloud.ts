import { Method } from "axios";
import { makeSendcloudRequest } from ".";
import { createParcelFromShipment } from "../parsers/shipment";

let options: { endpoint: string; method: Method; body: CreateLabelExportBody };

export async function createSendcloudLabel(shipment: ParsedTotalumShipment) {
  const parcel: CreateLabelExportBody = {
    parcel: createParcelFromShipment(shipment),
  };

  options = {
    endpoint: "parcels",
    method: "post" as Method,
    body: parcel,
  };

  await makeSendcloudRequest(options);
}
