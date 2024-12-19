import { TMandateIsFor, TMandateState } from '../enums';
import { TotalumOrder } from './pedido';

interface TMandate {
  _id: string;
  pedido: string;
  docuseal_submission_id: number;
  mandato_es_para: TMandateIsFor;
  estado: TMandateState;
}

interface TExtendedMandate extends TMandate {
  pedido: TotalumOrder;
}
