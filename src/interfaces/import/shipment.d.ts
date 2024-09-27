import { Request } from "express";

export interface CreateLabelImportBody extends Request {
  body: { totalumShipment: TotalumShipment; isTest: boolean };
}

export interface GetPdfLabelBody extends Request {
  body: { parcelId: number; startFrom: number };
}
