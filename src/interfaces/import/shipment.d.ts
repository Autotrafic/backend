import { Request } from 'express';

export interface CreateLabelImportBody extends Request {
  body: CreateLabelImport;
}

export interface GetPdfLabelBody extends Request {
  body: { parcelId: number; startFrom: number };
}

interface CreateLabelImport {
  totalumShipment: TotalumShipment;
  isTest: boolean;
}
