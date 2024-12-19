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
  const { clientType, name, firstSurname, secondSurname, nif, phoneNumber, address } = whatsappOrder.buyer;
  const {
    name: representativeName = '',
    firstSurname: representativeFirstSurname = '',
    secondSurname: representativeSecondSurname = '',
    nif: representativeNif = '',
  } = whatsappOrder.buyer.representative || {};

  if (
    !name &&
    !firstSurname &&
    !secondSurname &&
    !nif &&
    !phoneNumber &&
    !representativeName &&
    !representativeFirstSurname &&
    !representativeSecondSurname &&
    !representativeNif &&
    !address
  )
    return null;

  return {
    tipo: clientType,
    nombre_o_razon_social: name,
    primer_apellido: firstSurname,
    segundo_apellido: secondSurname,
    nif,
    telefono: phoneNumber,
    direccion: address,
  };
}

export function parseRelatedPersonFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): Partial<TClient> {
  const { clientType, name, firstSurname, secondSurname, nif, phoneNumber, address } = whatsappOrder.seller;
  const {
    name: representativeName = '',
    firstSurname: representativeFirstSurname = '',
    secondSurname: representativeSecondSurname = '',
    nif: representativeNif = '',
  } = whatsappOrder.seller.representative || {};

  if (
    !name &&
    !firstSurname &&
    !secondSurname &&
    !nif &&
    !phoneNumber &&
    !representativeName &&
    !representativeFirstSurname &&
    !representativeSecondSurname &&
    !representativeNif &&
    !address
  )
    return null;

  return {
    tipo: clientType,
    nombre_o_razon_social: name,
    primer_apellido: firstSurname,
    segundo_apellido: secondSurname,
    nif,
    telefono: phoneNumber,
    direccion: address,
  };
}

export function parseClientRepresentativeFromWhatsappToTotalum(whatsappOrder: WhatsappOrder): Partial<TRepresentative> {
  const { name, firstSurname, secondSurname, nif } = whatsappOrder.buyer.representative;
  if (!name && !firstSurname && !secondSurname && !nif) return null;

  return {
    nombre_o_razon_social: name,
    primer_apellido: firstSurname,
    segundo_apellido: secondSurname,
    nif,
  };
}

export function parseRelatedPersonRepresentativeFromWhatsappToTotalum(
  whatsappOrder: WhatsappOrder
): Partial<TRepresentative> {
  const { name, firstSurname, secondSurname, nif } = whatsappOrder.seller.representative;
  if (!name && !firstSurname && !secondSurname && !nif) return null;

  return {
    nombre_o_razon_social: name,
    primer_apellido: firstSurname,
    segundo_apellido: secondSurname,
    nif,
  };
}
