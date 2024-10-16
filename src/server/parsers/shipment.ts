import { TotalumShipment } from '../../interfaces/totalum/envio';

export function parseTotalumShipment(shipment: TotalumShipment): ParsedTotalumShipment {
  return {
    id: shipment._id,
    customerName: shipment.nombre_cliente,
    phone: shipment.telefono,
    address: shipment.direccion,
    houseNumber: shipment.numero_domicilio,
    postalCode: shipment.codigo_postal,
    city: shipment.localidad,
    email: shipment.email,
    reference: shipment.referencia,
    value: shipment.valor,
    trackingCode: shipment.codigo_seguimiento,
    trackingUrl: shipment.enlace_seguimiento,
  };
}

export function parseShipmentToTotalum(parsedShipment: ParsedTotalumShipment): TotalumShipment {
  return {
    _id: parsedShipment.id,
    nombre_cliente: parsedShipment.customerName,
    telefono: parsedShipment.phone,
    direccion: parsedShipment.address,
    numero_domicilio: parsedShipment.houseNumber,
    codigo_postal: parsedShipment.postalCode,
    localidad: parsedShipment.city,
    email: parsedShipment.email,
    referencia: parsedShipment.reference,
    valor: parsedShipment.value,
    codigo_seguimiento: parsedShipment.trackingCode,
    enlace_seguimiento: parsedShipment.trackingUrl,
  };
}

export function createParcelFromShipment(shipment: ParsedTotalumShipment, isTest: boolean): ParcelRequest {
  const carrier = {
    id: isTest ? 8 : 2189,
    name: isTest ? 'Unstamped Letter' : 'Correos Estandar Entrega a Domicilio 0-1kg',
  };

  return {
    reference: shipment.reference,
    order_number: shipment.reference,
    // to_service_point: 10571090,
    name: shipment.customerName,
    telephone: shipment.phone,
    address: shipment.address,
    house_number: shipment.houseNumber,
    postal_code: shipment.postalCode,
    city: shipment.city,
    country: 'ES',
    country_state: null,
    email: shipment.email ?? 'gestoria.autotrafic@gmail.com',
    customs_invoice_nr: '',
    customs_shipment_type: 1,
    parcel_items: [
      {
        description: 'Nueva documentación de vehículo',
        hs_code: '4907',
        origin_country: 'ES',
        product_id: '1',
        quantity: 1,
        value: shipment?.value?.toString() ?? '129.95',
        weight: '0.1',
      },
    ],
    weight: '0.02',
    length: '22',
    width: '11',
    height: '0.1',
    total_order_value: shipment?.value?.toString() ?? '129.95',
    total_order_value_currency: 'EUR',
    shipment: carrier,
    quantity: 1,
    total_insured_value: 0,
    is_return: false,
    request_label: true,
    apply_shipping_rules: false,
    request_label_async: false,
  };
}

export function parseAddressFromTotalumToRedeable(shipmentInfo: TotalumShipment): string {
  const { direccion, numero_domicilio, codigo_postal, localidad } = shipmentInfo;

  return `${direccion}, ${numero_domicilio}, ${codigo_postal}, ${localidad}`;
}
