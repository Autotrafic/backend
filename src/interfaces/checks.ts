export interface TCheck {
  reference: string;
  checks: Check[];
}

type CheckType = 'good' | 'warning' | 'bad';

export interface Check {
  id: number;
  title: string;
  type: CheckType;
}

export const TOTALUM_CHECKS: Record<string, Check> = {
  CLIENT_WITHOUT_ADDRESS: { id: 1, title: 'El cliente no contiene dirección.', type: 'warning' },
  PROFESSIONAL_WITHOUT_ADDRESS: { id: 2, title: 'El socio profesional no contiene dirección.', type: 'warning' },
  ORDER_WITHOUT_ADDRESS: { id: 3, title: 'El pedido no contiene dirección.', type: 'warning' },
  ADDRESS_INCOMPLETE: { id: 4, title: 'La dirección está incompleta.', type: 'warning' },
  ORDERS_WITHOUT_SHIPPING_ORDER: { id: 5, title: 'No hay pedidos pendiente de envío.', type: 'warning' },
};
