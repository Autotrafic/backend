import Client from '../../database/models/Client/Client';
import Invoice from '../../database/models/Invoice';
import { TotalumParsedOrder } from '../../database/models/Order/Order';
import { getInvoiceName } from '../../utils/invoice';
import { calculateInvoiceTotals, roundInvoiceServicesPrices, createInvoiceServicesList } from '../services/invoice';
import parseDatetimeToSpanish from './dates';

export default function parseInvoiceData(
  order: TotalumParsedOrder,
  client: Client,
  upcomingInvoiceNumber: number,
  isForClient: boolean
): Invoice {
  try {
    const servicesList = createInvoiceServicesList(order, isForClient);

    const servicesListWithRoundedPrices = roundInvoiceServicesPrices(servicesList);

    const totals = calculateInvoiceTotals(servicesList);

    const invoiceDate = parseDatetimeToSpanish(order.startDate);
    const invoiceNumber = getInvoiceName(upcomingInvoiceNumber);

    const invoiceOrder = {
      type: order.type,
      vehiclePlate: order.vehiclePlate,
    };

    const invoiceClient = {
      name: client.name,
      firstSurname: client.firstSurname,
      secondSurname: client.secondSurname,
      nif: client.nif,
      address: client.address,
      phoneNumber: client.phoneNumber,
      email: client.email,
    };

    return {
      order: invoiceOrder,
      client: invoiceClient,
      services: servicesListWithRoundedPrices,
      summary: {
        totalIVA: totals.totalIVA.toFixed(2),
        grandTotal: totals.grandTotal.toFixed(2),
      },
      invoiceDate,
      invoiceNumber,
    };
  } catch (error) {
    throw new Error('Error parseando los datos de la factura');
  }
}
