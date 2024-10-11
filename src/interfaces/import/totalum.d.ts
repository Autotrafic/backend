import { STRIPE_PRODUCTS } from '../../utils/constants';
import { TAccountingBusiness, TAccountingType, THeaderType } from '../enums';
import { TTask } from '../totalum/tarea';

export interface ToggleTotalumHeaderBody {
  body: {
    activeHeader: THeaderType;
  };
}

export interface UpdateTaskBody {
  body: {
    id: string;
    update: Partial<TTask>;
  };
}

export interface CreatePaymentLinkBody {
  body: {
    product: keyof typeof STRIPE_PRODUCTS;
    amount: number;
  };
}

export interface LogAccountingBody {
  body: {
    business: TAccountingBusiness;
    accountingType: TAccountingType;
  };
}
