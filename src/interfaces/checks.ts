export interface TCheck {
  reference: string;
  checks: Check[];
}

export interface Check {
  id: number;
  title: string;
  type: string;
}

export const TOTALUM_CHECKS = {
  CLIENT_WITHOUT_ADDRESS: { id: 1, title: 'El cliente no contiene dirección.', type: 'warning' },
  PROFESSIONAL_WITHOUT_ADDRESS: { id: 2, title: 'El socio profesional no contiene dirección.', type: 'warning' },
  ORDER_WITHOUT_ADDRESS: { id: 3, title: 'El pedido no contiene dirección.', type: 'warning' },
  ADDRESS_INCOMPLETE: { id: 4, title: 'La dirección está incompleta.', type: 'warning' },
  ORDERS_WITHOUT_SHIPPING_ORDER: { id: 5, title: 'No hay pedidos pendiente de envío.', type: 'warning' },
  SHIPMENT_WITHOUT_CUSTOMER_NAME: { id: 6, title: 'El envío no contiene nombre de destinatario', type: 'warning' },
  SHIPMENT_WITHOUT_PHONE: { id: 7, title: 'El envío no contiene nº de teléfono', type: 'warning' },
  SHIPMENT_WITHOUT_ADDRESS: { id: 8, title: 'El envío no contiene dirección', type: 'warning' },
  SHIPMENT_WITHOUT_HOUSE_NUMBER: { id: 9, title: 'El envío no contiene nº de domicilio', type: 'warning' },
  SHIPMENT_WITHOUT_POSTAL_CODE: { id: 10, title: 'El envío no contiene código postal', type: 'warning' },
  SHIPMENT_WITHOUT_CITY: { id: 11, title: 'El envío no contiene localidad', type: 'warning' },
  SHIPMENT_WITHOUT_REFERENCE: { id: 12, title: 'El envío no contiene referencia', type: 'warning' },
};
