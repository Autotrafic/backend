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
    {
      check: (value: string) => (value ? value.length <= 50 : true),
      checkInfo: { title: 'El nombre del cliente debe contener como máximo 50 caracteres', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'El nombre del cliente no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'El nombre del cliente no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],

  telefono: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene nº de teléfono', type: CheckType.BAD },
    },
    {
      check: (value: string) => (value ? value.length <= 15 : true),
      checkInfo: { title: 'El nº de teléfono debe contener como máximo 15 caracteres', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'El nº de teléfono no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'El nº de teléfono no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],

  direccion: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene calle', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'La calle no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => (value ? value.length <= 55 : true),
      checkInfo: { title: 'La calle debe contener como máximo 55 caracteres', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'La calle no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],

  numero_domicilio: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene nº de domicilio', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'El nº de domicilio no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => (value ? value.length <= 20 : true),
      checkInfo: { title: 'El nº de domicilio debe contener como máximo 20 caracteres', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'El nº de domicilio no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],

  codigo_postal: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene código postal', type: CheckType.BAD },
    },
    {
      check: (value: string) => (value ? /^[0-9]+$/.test(value) : true),
      checkInfo: { title: 'El código postal no debe contener letras', type: CheckType.BAD },
    },
    {
      check: (value: string) => (value ? value.length === 5 : true),
      checkInfo: { title: 'El código postal debe contener exactamente 5 caracteres', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'El código postal no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'El código postal no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],

  localidad: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene localidad', type: CheckType.BAD },
    },
    {
      check: (value: string) => (value ? value.length <= 30 : true),
      checkInfo: { title: 'La localidad debe contener como máximo 30 carácteres', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'La localidad no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'La localidad no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],

  referencia: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El envío no contiene referencia', type: CheckType.BAD },
    },
    {
      check: (value: string) => !/[\n\t]/.test(value),
      checkInfo: { title: 'La referencia no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
    {
      check: (value: string) => {
        if (!value) return true;
        const normalizedValue = value.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
        const hasInvalidChars = /[\n\t]/.test(normalizedValue);

        return normalizedValue ? !hasInvalidChars : true;
      },
      checkInfo: { title: 'La referencia no debe contener saltos de línea o tabulaciones', type: CheckType.BAD },
    },
  ],
};
