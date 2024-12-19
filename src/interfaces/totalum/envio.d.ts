import { TExtendedOrder, TotalumOrder } from './pedido';

export interface TotalumShipment {
  _id: string;
  con_distintivo: 'Si' | 'No';
  nombre_cliente: string;
  telefono: string;
  direccion: string;
  numero_domicilio: string;
  codigo_postal: string;
  localidad: string;
  email: string;
  referencia: string;
  codigo_seguimiento: string;
  enlace_seguimiento: string;
  sendcloud_parcel_id: number;
}

export interface ExtendedTotalumShipment extends TotalumShipment {
  pedido: TExtendedOrder[];
}
