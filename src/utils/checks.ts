import { CheckType, TCheck } from '../interfaces/checks';
import { ExtendedTotalumOrder } from '../interfaces/totalum/pedido';

export function handleOrdersWithWrongNumberOfShipments(
  failedChecks: TCheck[],
  ordersWithoutShipment: ExtendedTotalumOrder[],
  ordersWithMultipleShipments: ExtendedTotalumOrder[]
) {
  for (let order of ordersWithoutShipment) {
    failedChecks.push({
      shipmentId: null,
      reference: order.matricula,
      checks: [{ title: 'El pedido no tiene ningún envío relacionado', type: CheckType.BAD }],
    });
  }

  for (let order of ordersWithMultipleShipments) {
    failedChecks.push({
      shipmentId: null,
      reference: order.matricula,
      checks: [{ title: 'El pedido contiene más de un envío relacionado', type: CheckType.BAD }],
    });
  }
}

export const FIELD_CONDITIONS = {
  nombre_cliente: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene nombre de destinatario', type: CheckType.BAD },
    },
  ],

  telefono: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene nº de teléfono', type: CheckType.BAD },
    },
  ],

  direccion: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene calle', type: CheckType.BAD },
    },
  ],

  numero_domicilio: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene nº de domicilio', type: CheckType.BAD },
    },
  ],

  codigo_postal: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene código postal', type: CheckType.BAD },
    },
  ],

  localidad: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene localidad', type: CheckType.BAD },
    },
    {
      check: (value: string) => value.length <= 30,
      checkInfo: { title: 'La localidad debe contener como máximo 30 carácteres', type: CheckType.BAD },
    },
  ],

  referencia: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene referencia', type: CheckType.BAD },
    },
  ],
};
