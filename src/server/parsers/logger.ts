import { Accounting, TAccounting } from '../../interfaces/totalum/contabilidad';

export function parseAccountingFromTotalum(accounting: Accounting): TAccounting {
  return {
    _id: accounting.id,
    fecha: accounting.date,
    negocio: accounting.business,
    tipo_contador: accounting.accountingType,
  };
}
