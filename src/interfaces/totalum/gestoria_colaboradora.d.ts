import { TotalumOrder } from './pedido';

interface TCollaborator {
  _id: string;
  nombre: string;
  modalidad_de_contacto: 'WhatsApp' | 'Email';
  whatsapp: number;
  email: number;
  nombre_gestor: string;
  nif_gestor: string;
  num_colegiado_gestor: number;
  nombre_colegio_gestor: string;
  despacho_profesional: string;
  domicilio_despacho_profesional: string;
  createdAt: string;
  updatedAt: string;
}

interface TExtendedCollaborator extends TCollaborator {
  pedido: TotalumOrder;
}
