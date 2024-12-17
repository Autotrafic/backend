import { Request } from 'express';
import { STRIPE_PRODUCTS } from '../../utils/constants';
import { TAccountingBusiness, TAccountingType, THeaderType } from '../enums';
import { TTask } from '../totalum/tarea';
import { TotalumShipment } from '../totalum/envio';

export interface ToggleTotalumHeaderBody extends Request {
  body: {
    activeHeader: THeaderType;
  };
}

export interface UpdateTaskBody extends Request {
  body: {
    id: string;
    update: Partial<TTask>;
  };
}

export interface CreatePaymentLinkBody extends Request {
  body: {
    product: keyof typeof STRIPE_PRODUCTS;
    amount: number;
  };
}

export interface LogAccountingBody extends Request {
  body: {
    business: TAccountingBusiness;
    accountingType: TAccountingType;
  };
}

export interface SendOrderMandatesBody {
  body: { orderId: string; mandateIsFor: MandateIsFor };
}

export interface MandateIsFor {
  client: boolean;
  relatedPerson: boolean;
}
