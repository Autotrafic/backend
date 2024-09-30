import { TotalumApiSdk } from 'totalum-api-sdk';
import Invoice, { InternInvoiceService } from '../../database/models/Invoice';
import { TotalumParsedOrder } from '../../database/models/Order/Order';
import { SHIPMENT_COST, ORDER_TYPES, totalumOptions } from '../../utils/constants';
import fetch from 'node-fetch';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import { parseOrderFromTotalumToWeb } from '../parsers/order';
import parseClientFromPrimitive from '../parsers/client';
import parseInvoiceData from '../parsers/invoice';
import { createPdfFromStringLogic } from './file';
import { bufferToBase64 } from '../parsers/file';
import { InvoiceErrorOptions, InvoiceOptions, InvoicePrimitiveOptions, InvoiceSuccessOptions } from '../../interfaces/invoice';

const ORDER_PROFITS = 17;
const INVOICE_NUMBER_DOC_ID = '668cf28abc3208d35c20fdc8';
const TOTALUM_INVOICE_TEMPLATE_ID = '668555647039d527e634233d';

const totalumSdk = new TotalumApiSdk(totalumOptions);

function getOrderTypeDetails(orderType: string) {
  let taxValue = null;
  let hasShipmentCost = null;

  if (orderType === 'Transferencia') {
    taxValue = ORDER_TYPES.TRANSFERENCE.taxValue;
    hasShipmentCost = ORDER_TYPES.TRANSFERENCE.hasShipment;
  } else if (orderType === 'Transferencia ciclomotor') {
    taxValue = ORDER_TYPES.TRANSFERENCE_CICL.taxValue;
    hasShipmentCost = ORDER_TYPES.TRANSFERENCE_CICL.hasShipment;
  } else if (orderType === 'Entrega compraventa') {
    taxValue = ORDER_TYPES.NOTIFICATION.taxValue;
    hasShipmentCost = ORDER_TYPES.NOTIFICATION.hasShipment;
  } else if (orderType === 'Transferencia por finalizacion entrega') {
    taxValue = ORDER_TYPES.TRANSFERENCE.taxValue;
    hasShipmentCost = ORDER_TYPES.TRANSFERENCE.hasShipment;
  } else if (orderType === 'Duplicado permiso') {
    taxValue = ORDER_TYPES.PERMIT_DUPLICATE.taxValue;
    hasShipmentCost = ORDER_TYPES.PERMIT_DUPLICATE.hasShipment;
  } else if (orderType === 'Distintivo') {
    taxValue = ORDER_TYPES.DISTINCTIVE.taxValue;
    hasShipmentCost = ORDER_TYPES.DISTINCTIVE.hasShipment;
  } else if (orderType === 'Notificacion') {
    taxValue = ORDER_TYPES.NOTIFICATION.taxValue;
    hasShipmentCost = ORDER_TYPES.NOTIFICATION.hasShipment;
  }

  if (taxValue === null || hasShipmentCost === null) {
    taxValue = 0;
    hasShipmentCost = 0;
  }

  return { taxValue, hasShipmentCost };
}

export function createInvoiceServicesList(
  currentInvoiceData: TotalumParsedOrder,
  isForClient: boolean
): InternInvoiceService[] {
  const { type, itpPaid, totalInvoiced } = currentInvoiceData;

  const { taxValue, hasShipmentCost } = getOrderTypeDetails(type);
  const shipmentCost = SHIPMENT_COST;

  const taxDGT = {
    description: 'Tasa DGT',
    quantity: 1,
    priceWithoutIVA: '-' as '-',
    priceWithIVA: '-' as '-',
    totalPrice: taxValue,
  };

  const taxITP = itpPaid && {
    description: 'Tasa ITP',
    quantity: 1,
    priceWithoutIVA: '-' as '-',
    priceWithIVA: '-' as '-',
    totalPrice: itpPaid,
  };

  const shipment = hasShipmentCost
    ? {
        description: 'Envío',
        quantity: 1,
        priceWithoutIVA: '-' as '-',
        priceWithIVA: '-' as '-',
        totalPrice: shipmentCost,
      }
    : null;

  let totalProfitsWithIVA: number;

  if (isForClient) {
    totalProfitsWithIVA =
      totalInvoiced - taxDGT.totalPrice - (taxITP ? taxITP.totalPrice : 0) - (shipment ? shipment.totalPrice : 0);
  } else {
    totalProfitsWithIVA = ORDER_PROFITS;
  }

  const profitsWithoutIVA = (totalProfitsWithIVA * 100) / 121;

  const profits = {
    description: 'Honorarios',
    quantity: 1,
    priceWithoutIVA: profitsWithoutIVA,
    priceWithIVA: totalProfitsWithIVA,
    totalPrice: totalProfitsWithIVA,
  };

  const servicesList = [taxDGT, taxITP, shipment, profits].filter(
    (item) => item !== null && item !== undefined && typeof item === 'object'
  );

  return servicesList;
}

export function roundInvoiceServicesPrices(services: InternInvoiceService[]) {
  const roundedServices = services.map((service) => {
    return {
      ...service,
      priceWithoutIVA:
        typeof service.priceWithoutIVA === 'number' ? service.priceWithoutIVA.toFixed(2) : service.priceWithoutIVA,
      priceWithIVA: typeof service.priceWithIVA === 'number' ? service.priceWithIVA.toFixed(2) : service.priceWithIVA,
      totalPrice: typeof service.totalPrice === 'number' ? service.totalPrice.toFixed(2) : null,
    };
  });

  return roundedServices;
}

export function calculateInvoiceTotals(services: InternInvoiceService[]) {
  const totalPriceWithIVA = services.reduce(
    (total, service) => (typeof service.priceWithIVA === 'number' ? total + service.priceWithIVA : total),
    0
  );

  const totalPriceWithoutIVA = services.reduce(
    (total, service) => (typeof service.priceWithoutIVA === 'number' ? total + service.priceWithoutIVA : total),
    0
  );

  const totalIVA = totalPriceWithIVA - totalPriceWithoutIVA;

  const grandTotal = services.reduce(
    (total, service) => (typeof service.totalPrice === 'number' ? total + service.totalPrice : total),
    0
  );

  return { totalIVA, grandTotal };
}

export function updateInvoiceNumber(currentInvoiceNumber: number): number {
  return currentInvoiceNumber + 1;
}

export async function createInvoiceDataLogic(options: InvoicePrimitiveOptions) {
  const { orderData, clientData, invoiceNumber, isForClient } = options;

  const order = parseOrderFromTotalumToWeb(orderData);
  const client = parseClientFromPrimitive(clientData);

  if (!client) {
    throw new Error(`${order.vehiclePlate} no contiene cliente o socio profesional para generar la factura.`);
  }

  if (!client.address && !order.shipmentAddress) {
    throw new Error(`${order.vehiclePlate} no contiene direccion para generar la factura.`);
  }

  const invoiceData = parseInvoiceData(order, client, invoiceNumber, isForClient);

  return invoiceData;
}

export async function generateMultipleInvoicesOptionsLogic(
  orders: TotalumOrder[]
): Promise<InvoiceSuccessOptions | InvoiceErrorOptions> {
  // if (orders.length > 20) {
  //   throw new Error('Selecciona la opción de mostrar 20 pedidos por página, como máximo');
  // }

  const invoiceNumberResponse = await totalumSdk.crud.getItemById('numero_factura', INVOICE_NUMBER_DOC_ID);
  let currentInvoiceNumber = invoiceNumberResponse.data.data.numero_factura;

  const optionRequests = orders.map((order, index) => {
    const invoiceNumber = currentInvoiceNumber + index + 1;
    return fetchInvoiceOptions(order, invoiceNumber);
  });
  const invoicesOptions = await Promise.all(optionRequests);

  await totalumSdk.crud.editItemById('numero_factura', INVOICE_NUMBER_DOC_ID, {
    numero_factura: currentInvoiceNumber + orders.length,
  });

  const errors = invoicesOptions.filter((option) => typeof option === 'string').join('\n');

  if (errors.length > 0) {
    const pdfWithErrors = await createPdfFromStringLogic(errors);

    return {
      success: false,
      message: 'No se han podido generar las facturas. Se ha descargado un PDF con los errores.',
      pdfWithErrors,
    };
  }

  return { success: true, invoicesOptions } as InvoiceSuccessOptions;
}

async function generateInvoiceOptions(orderData: TotalumOrder, invoiceNumber: number): Promise<InvoiceOptions> {
  try {
    const clientResponse = orderData.cliente ? await totalumSdk.crud.getItemById('cliente', orderData.cliente) : null;
    const clientData = clientResponse ? clientResponse.data.data : null;

    const partnerResponse = orderData.socio_profesional
      ? await totalumSdk.crud.getItemById('socios_profesionales', orderData.socio_profesional)
      : null;
    const partnerClientResponse =
      partnerResponse && partnerResponse.data && partnerResponse.data.data
        ? await totalumSdk.crud.getItemById('cliente', partnerResponse.data.data.cliente)
        : null;
    const partnerClientData = partnerClientResponse ? partnerClientResponse.data.data : null;

    const isForClient = false;

    const invoiceOptions: InvoicePrimitiveOptions = {
      orderData,
      clientData: partnerClientData ?? clientData,
      invoiceNumber,
      isForClient,
    };

    const invoiceData = await createInvoiceDataLogic(invoiceOptions);

    return { invoiceData, invoiceNumber, orderDataId: orderData._id };
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data);
    } else {
      throw new Error(`No se ha podido generar la factura de ${orderData.matricula}`);
    }
  }
}

export async function fetchInvoiceOptions(order: TotalumOrder, invoiceNumber: number): Promise<InvoiceOptions | string> {
  try {
    return await generateInvoiceOptions(order, invoiceNumber);
  } catch (error) {
    return error.response ? error.response.data : error.message;
  }
}

export async function generateInvoiceBlob({ invoiceData, orderDataId }: InvoiceOptions) {
  try {
    const fileName = `factura-${invoiceData.invoiceNumber}.pdf`;

    const file = await totalumSdk.files.generatePdfByTemplate(TOTALUM_INVOICE_TEMPLATE_ID, invoiceData, fileName);

    await totalumSdk.crud.editItemById('pedido', orderDataId, {
      factura: { name: fileName },
    });

    const response = await fetch(file.data.data.url);
    const buffer = await response.buffer();
    return buffer;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.response?.data || error.message || 'Unknown error';
    throw new Error(`Error creating Totalum invoice.
      Order id: ${orderDataId}
      Error: ${JSON.stringify(errorMessage)}`);
  }
}

export async function generateInvoicesBase64(invoicesOptions: InvoiceOptions[]) {
  const invoicesBuffers = [];

  for (const invoiceOption of invoicesOptions) {
    try {
      const buffer = await generateInvoiceBlob(invoiceOption);
      invoicesBuffers.push(buffer);
    } catch (error) {
      throw new Error(error);
    }
  }

  const invoicesBase64 = await Promise.all(invoicesBuffers.map(bufferToBase64));

  return invoicesBase64;
}
