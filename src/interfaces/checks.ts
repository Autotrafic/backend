export interface TCheck {
  referenceId: string;
  reference: string;
  checks: Check[];
}

export interface Check {
  id: number;
  title: string;
  type: CheckType;
}

export enum CheckType {
  GOOD = 1,
  WARNING = 2,
  BAD = 3,
}

export const TOTALUM_CHECKS = {
  CLIENT_WITHOUT_ADDRESS: { id: 1, title: 'El cliente no contiene dirección.', type: CheckType.WARNING },
  PROFESSIONAL_WITHOUT_ADDRESS: { id: 2, title: 'El socio profesional no contiene dirección.', type: CheckType.WARNING },
  ORDER_WITHOUT_ADDRESS: { id: 3, title: 'El pedido no contiene dirección.', type: CheckType.WARNING },
  ADDRESS_INCOMPLETE: { id: 4, title: 'La dirección está incompleta.', type: CheckType.WARNING },
  ORDERS_WITHOUT_SHIPPING_ORDER: { id: 5, title: 'No hay pedidos pendiente de envío.', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_CUSTOMER_NAME: { id: 6, title: 'El envío no contiene nombre de destinatario', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_PHONE: { id: 7, title: 'El envío no contiene nº de teléfono', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_ADDRESS: { id: 8, title: 'El envío no contiene dirección', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_HOUSE_NUMBER: { id: 9, title: 'El envío no contiene nº de domicilio', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_POSTAL_CODE: { id: 10, title: 'El envío no contiene código postal', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_CITY: { id: 11, title: 'El envío no contiene localidad', type: CheckType.WARNING },
  SHIPMENT_WITHOUT_REFERENCE: { id: 12, title: 'El envío no contiene referencia', type: CheckType.WARNING },
  ORDER_AVAILABLE_FOR_SHIP: { id: 13, title: 'El pedido está listo para enviar', type: CheckType.GOOD },
  SHIPMENT_WITH_CITY_WITH_MORE_30_CHAR: {
    id: 14,
    title: 'La localidad debe contener como máximo 30 carácteres',
    type: CheckType.WARNING,
  },
};
