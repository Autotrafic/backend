import Client from "../../database/models/Client/Client";
import Invoice from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import {
    createInvoiceServicesListFromTotalInvoiced,
    calculateInvoiceTotals,
    roundInvoiceServicesPrices,
    createInvoiceServicesListFromProfits,
} from "../services/invoice";
import parseDatetimeToSpanish from "./dates";

export default function parseInvoiceData(
    order: IOrder,
    client: Client,
    upcomingInvoiceNumber: number
): Invoice {
    const servicesList = createInvoiceServicesListFromProfits(order);

    const servicesListWithRoundedPrices =
        roundInvoiceServicesPrices(servicesList);
    const totals = calculateInvoiceTotals(servicesList);

    const invoiceDate = parseDatetimeToSpanish(order.startDate);
    const invoiceNumber = `${upcomingInvoiceNumber}`;

    const invoiceClient = {
        name: client.name,
        firstSurname: client.firstSurname,
        secondSurname: client.secondSurname,
        nif: client.nif,
        address: order.shipmentAddress,
        phoneNumber: client.phoneNumber,
        email: client.email,
    };

    return {
        client: invoiceClient,
        services: servicesListWithRoundedPrices,
        summary: {
            totalIVA: totals.totalIVA.toFixed(2),
            grandTotal: totals.grandTotal.toFixed(2),
        },
        invoiceDate,
        invoiceNumber,
    };
}
