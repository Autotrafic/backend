import { TAccountingBusiness, TAccountingType } from '../enums';

export interface TAccounting {
  _id: string;
  fecha: Date;
  negocio: TAccountingBusiness;
  tipo_contador: TAccountingType;
}

export interface Accounting {
  id?: string;
  date: Date;
  business: TAccountingBusiness;
  accountingType: TAccountingType;
}
