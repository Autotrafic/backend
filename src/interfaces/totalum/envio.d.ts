import { TotalumOrder } from './pedido';

export interface TotalumShipment {
  _id: string;
  nombre_cliente: string;
  telefono: string;
  direccion: string;
  numero_domicilio: string;
  codigo_postal: string;
  localidad: string;
  email: string;
  referencia: string;
  valor: number;
  seguimiento: string;
}

export interface ExtendedTotalumShipment extends TotalumShipment {
  pedido: TotalumOrder[];
}
