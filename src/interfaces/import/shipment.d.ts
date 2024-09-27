import { Request } from "express";

export interface CreateLabelImportBody extends Request {
  body: { totalumShipment: TotalumShipment; isTest: boolean };
}
