import Client from "../../database/models/Client/Client";
import Invoice from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import {
    createInvoiceServicesList,
    calculateInvoiceTotals,
    roundInvoiceServicesPrices,
} from "../services/invoice";
import parseDatetimeToSpanish from "./dates";

export default function parseInvoiceData(
    order: IOrder,
    client: Client,
    upcomingInvoiceNumber: number
): Invoice {
    const internServicesList = createInvoiceServicesList(order);

    const servicesList = roundInvoiceServicesPrices(internServicesList);
    const totals = calculateInvoiceTotals(internServicesList);

    const invoiceDate = parseDatetimeToSpanish(order.startDate);
    const invoiceNumber = `${upcomingInvoiceNumber}`;

    const invoiceClient = {
        name: client.name,
        firstSurname: client.firstSurname,
        secondSurname: client.secondSurname,
        nif: client.nif,
        email: client.email,
        phoneNumber: client.phoneNumber,
    };

    return {
        client: invoiceClient,
        services: servicesList,
        summary: {
            totalIVA: totals.totalIVA.toFixed(2),
            grandTotal: totals.grandTotal.toFixed(2),
        },
        invoiceDate,
        invoiceNumber,
    };
}
