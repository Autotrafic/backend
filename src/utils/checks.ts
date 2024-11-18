import { ExtendedTotalumOrder } from '../interfaces/totalum/pedido';
import { Check, CheckCondition, CheckType, TCheck } from '../interfaces/checks';


export function generateChecks<T>(
  entity: T | null | undefined,
  fieldConditions: Record<string, CheckCondition[]>
): { hasError: boolean; passedChecks: Check[]; failedChecks: Check[] } {
  const checks: Check[] = [];
  let hasError = false;

  if (!entity) {
    Object.keys(fieldConditions).forEach((field) => {
      checks.push({
        propertyChecked: field,
        title: `El campo ${field} no está disponible`,
        type: CheckType.BAD,
      });
    });
    hasError = true;

    return {
      hasError,
      passedChecks: [],
      failedChecks: checks,
    };
  }

  for (const [field, conditions] of Object.entries(fieldConditions)) {
    const fieldValue = entity[field as keyof T];

    conditions.forEach(({ check, checkInfo }) => {
      if (!check(fieldValue as string)) {
        checks.push({ ...checkInfo, propertyChecked: field });
        hasError = true;
      }
    });
  }

  if (!hasError) {
    checks.push({ title: `Ha pasado todas las revisiones correctamente`, type: CheckType.GOOD });
  }

  const passedChecks = checks.filter((check) => check.type === CheckType.GOOD);
  const failedChecks = checks.filter((check) => check.type !== CheckType.GOOD);

  return { hasError, passedChecks, failedChecks };
}


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

export const ORDER_FIELD_CONDITIONS = {
  comunidad_autonoma: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Comunidad Autónoma', type: CheckType.BAD },
    },
  ],
  estado: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Estado', type: CheckType.BAD },
    },
  ],
  tipo: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Tipo de trámite', type: CheckType.BAD },
    },
  ],
  fecha_inicio: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Fecha Inicio', type: CheckType.BAD },
    },
  ],
  matricula: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Matricula', type: CheckType.BAD },
    },
  ],
  documentos: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Documentos', type: CheckType.BAD },
    },
  ],
  fecha_de_contacto: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Fecha de Contacto', type: CheckType.BAD },
    },
  ],
  total_facturado: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Total Facturado', type: CheckType.BAD },
    },
  ],
  mandatos: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El pedido no contiene Mandatos', type: CheckType.BAD },
    },
  ],
};

export const CLIENT_FIELD_CONDITIONS = {
  nif: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El cliente no contiene NIF', type: CheckType.BAD },
    },
  ],
  tipo: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El cliente no contiene Tipo', type: CheckType.BAD },
    },
  ],
  nombre_o_razon_social: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El cliente no contiene Nombre o Razón Social', type: CheckType.BAD },
    },
  ],
  primer_apellido: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El cliente no contiene Primer Apellido', type: CheckType.BAD },
    },
  ],
  telefono: [
    {
      check: (value: string) => !!value,
      checkInfo: { title: 'El cliente no contiene Telefono', type: CheckType.BAD },
    },
  ],
};

export const SHIPMENT_FIELD_CONDITIONS = {
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
      check: (value: string) => (value ? value.replace(/\s+/g, '').length <= 15 : true),
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
