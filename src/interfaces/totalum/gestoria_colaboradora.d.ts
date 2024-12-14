import { TotalumOrder } from "./pedido";

interface TCollaborator {
    _id: string;
    nombre: string;
    modalidad_de_contacto: 'WhatsApp' | 'Email';
    whatsapp: number;
    email: number;
    createdAt: string;
    updatedAt: string;
  }
  
  interface TExtendedCollaborator extends TCollaborator {
    pedido: TotalumOrder;
  }