import Client from '../../database/models/Client/Client';
import { WhatsappOrder } from '../../interfaces/import/order';

export default function parseClientFromPrimitive(client: TClient): Client {
  if (!client) return null;

  return {
    _id: client._id,
    id: client.id,
    type: client.tipo,
    name: client.nombre_o_razon_social,
    firstSurname: client.primer_apellido,
    secondSurname: client.segundo_apellido,
    nif: client.nif,
    address: client.direccion,
    phoneNumber: client.telefono,
    email: client.email,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt,
  };
}

export function parseClientFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): Partial<TClient> {
  const { clientType, name, firstSurname, secondSurname, nif, phoneNumber } = whatsappOrder.buyer;
  if (!name && !firstSurname && !secondSurname && !nif && !phoneNumber) return null;

  return {
    tipo: clientType,
    nombre_o_razon_social: name,
    primer_apellido: firstSurname,
    segundo_apellido: secondSurname,
    nif,
    telefono: phoneNumber,
  };
}

export function parseRelatedPersonFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): Partial<TClient> {
  const { clientType, name, firstSurname, secondSurname, nif, phoneNumber } = whatsappOrder.seller;
  if (!name && !firstSurname && !secondSurname && !nif && !phoneNumber) return null;

  return {
    tipo: clientType,
    nombre_o_razon_social: name,
    primer_apellido: firstSurname,
    segundo_apellido: secondSurname,
    nif,
    telefono: phoneNumber,
  };
}
