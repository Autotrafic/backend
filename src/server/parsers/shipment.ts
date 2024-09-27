export function parseTotalumShipment(
  shipment: TotalumShipment
): ParsedTotalumShipment {
  return {
    customerName: shipment.nombre_cliente,
    phone: shipment.telefono,
    address: shipment.direccion,
    houseNumber: shipment.numero_domicilio,
    postalCode: shipment.codigo_postal,
    city: shipment.localidad,
    email: shipment.email,
    reference: shipment.referencia,
    value: shipment.valor,
    tracking: shipment.seguimiento,
  };
}

export function parseShipmentToTotalum(
  parsedShipment: ParsedTotalumShipment
): TotalumShipment {
  return {
    nombre_cliente: parsedShipment.customerName,
    telefono: parsedShipment.phone,
    direccion: parsedShipment.address,
    numero_domicilio: parsedShipment.houseNumber,
    codigo_postal: parsedShipment.postalCode,
    localidad: parsedShipment.city,
    email: parsedShipment.email,
    referencia: parsedShipment.reference,
    valor: parsedShipment.value,
    seguimiento: parsedShipment.tracking,
  };
}
