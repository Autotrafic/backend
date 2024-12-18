import { TMandateIsFor, TMandateSigned } from "../enums";

export interface TMandate {
  _id: string;
  pedido: string;
  docuseal_submission_id: number;
  mandato_es_para: TMandateIsFor;
  firmado: TMandateSigned;
}