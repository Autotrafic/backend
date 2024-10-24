import { Request } from 'express';
import { ExtendedTotalumShipment, TotalumShipment } from '../totalum/envio';

interface MakeMultipleShipmentsImportBody {
  body: MakeMultipleShipmentsImport;
}

export interface CreateLabelImportBody extends Request {
  body: CreateLabelImport;
}

export interface GetPdfLabelBody extends Request {
  body: { parcelId: number; startFrom: number };
}

interface MakeMultipleShipmentsImport {
  ordersId: string[];
  isTest: boolean;
}

interface CreateLabelImport {
  totalumShipment: ExtendedTotalumShipment;
  isTest: boolean;
}
