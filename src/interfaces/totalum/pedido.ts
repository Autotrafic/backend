import { AutonomousCommunityValue } from '../enums';
import { ExtendedTotalumShipment } from './envio';

export interface TotalumOrder {
  comunidad_autonoma: TAutonomousCommunity;
  prioridad: TPriority;
  estado: TState;
  tipo: TType;
  fecha_inicio: Date;
  factura: object;
  matricula: string;
  documentos: string;
  direccion_envio: string;
  codigo_envio: string;
  notas: string;
  itp_pagado: number;
  fecha_de_contacto: Date;
  total_facturado: number;
  mandatos: TMandate;
  autotrafic_id: string;
  cliente: string;
  socio_profesional: string;
  createdAt: string;
  updatedAt: string;
  metadata: object;
  _id: string;
}

export interface ExtendedTotalumOrder extends Omit<TotalumOrder, 'cliente'> {
  cliente: TClient;
  envio: ExtendedTotalumShipment[];
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
  mandates: TMandate;
  autotraficId: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
  metadata: object;
  _id: string;
}

export type TAutonomousCommunity =
  | 'Cataluña'
  | 'Andalucía'
  | 'Aragón'
  | 'Asturias'
  | 'Baleares'
  | 'Canarias'
  | 'Cantabria'
  | 'Castilla y León'
  | 'Castilla la Mancha'
  | 'Extremadura'
  | 'Galicia'
  | 'Madrid'
  | 'Murcia'
  | 'Navarra'
  | 'País Vasco'
  | 'La Rioja'
  | 'Valencia';

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
  | 'Pendiente recoger Correos'
  | 'Nuevo pedido web'
  | 'Nuevo pedido WhatsApp'
  | 'Pendiente devolución Correos'
  | 'Pendiente entrega Correos';

type TType =
  | 'Transferencia'
  | 'Duplicado permiso'
  | 'Distintivo'
  | 'Notificacion'
  | 'Transferencia ciclomotor'
  | 'Entrega compraventa'
  | 'Transferencia por finalizacion entrega'
  | 'Alta por baja voluntaria'
  | 'Cambio de domicilio'
  | 'Baja temporal';

type TMandate = 'No enviados' | 'Enviados' | 'Firmados' | 'Adjuntados';
