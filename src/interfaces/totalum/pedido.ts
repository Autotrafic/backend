import { AutonomousCommunity, AutonomousCommunityValue } from '../enums';
import { ExtendedTotalumShipment } from './envio';
import { TCollaborator } from './gestoria_colaboradora';
import { TMandate } from './mandato';
import { TExtendedProfessionalPartner } from './socio_profesional';

export interface TotalumOrder {
  comunidad_autonoma: AutonomousCommunity;
  prioridad: TPriority;
  estado: TState;
  tipo: TType;
  fecha_inicio: Date;
  factura: object;
  matricula: string;
  documentos: string;
  notas: string;
  itp_pagado: number;
  fecha_de_contacto: Date;
  total_facturado: number;
  mandatos: TOrderMandate;
  autotrafic_id: string;
  cliente: string;
  socio_profesional: string;
  createdAt: string;
  updatedAt: string;
  metadata: object;
  _id: string;
}

export interface TExtendedOrder extends Omit<TotalumOrder, 'cliente' | 'socio_profesional'> {
  cliente: TExtendedClient;
  envio: ExtendedTotalumShipment[];
  persona_relacionada: TExtendedRelatedPerson[];
  socio_profesional: TExtendedProfessionalPartner;
  gestoria_colaboradora: TCollaborator;
  mandato: TMandate[];
}

interface TotalumParsedOrder {
  autonomousCommunity: AutonomousCommunityValue;
  priority: string;
  state: string;
  type: string;
  startDate: Date;
  invoice: object;
  vehiclePlate: string;
  documentsLink: string;
  shipmentAddress: string;
  shipmentCode: string;
  notes: string;
  itpPaid: number;
  totalInvoiced: number;
  mandates: TOrderMandate;
  autotraficId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  metadata: object;
  _id: string;
}

type TPriority = 'Normal' | 'Alta';

export type TState =
  | 'Pendiente Tramitar A9'
  | 'Pendiente Entrega Tráfico'
  | 'En Tráfico'
  | 'Pendiente Envío Cliente'
  | 'Rechazado'
  | 'Enviado Cliente'
  | 'Entregado Cliente'
  | 'Pendiente Recibir Permiso Gestoría'
  | 'Pendiente Pago ITP'
  | 'Pendiente enviar 3º gestoría'
  | 'Enviado 3º gestoría'
  | 'Pendiente recibir info cliente'
  | 'Nuevo pedido web'
  | 'Pendiente devolución Correos'
  | 'Pendiente entrega Correos'
  | 'Pendiente Pago Devolución Envío'
  | 'Pendiente Pago Trámite';

type TType =
  | 'Transferencia'
  | 'Duplicado permiso'
  | 'Distintivo'
  | 'Notificacion'
  | 'Entrega compraventa'
  | 'Transferencia por finalizacion entrega'
  | 'Alta por baja voluntaria'
  | 'Cambio de domicilio'
  | 'Baja temporal';

type TOrderMandate = 'No enviados' | 'Enviados' | 'Firmados' | 'Adjuntados';
