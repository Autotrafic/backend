import Client from "../../database/models/Client/Client";
import Invoice from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import { createRedeableDate } from "../../utils/funcs";
import {
    createInvoiceServicesList,
    calculateInvoiceTotals,
    roundInvoiceServicesPrices,
    updateInvoiceNumber,
} from "../services/invoice";

export default function parseInvoiceData(
    order: IOrder,
    client: Client,
    currentInvoiceNumber: string
): Invoice {
    const internServicesList = createInvoiceServicesList(order);

    const servicesList = roundInvoiceServicesPrices(internServicesList);
    const totals = calculateInvoiceTotals(internServicesList);

    const invoiceClient = {
        name: client.name,
        firstSurname: client.firstSurname,
        secondSurname: client.secondSurname,
        nif: client.nif,
        email: client.email,
        phoneNumber: client.phoneNumber,
    };

    const invoiceNumber: string = updateInvoiceNumber(+currentInvoiceNumber).toString();
    const invoiceDate = createRedeableDate(order.startDate);

    return {
        client: invoiceClient,
        services: servicesList,
        summary: {
            totalIVA: totals.totalIVA.toFixed(2),
            grandTotal: totals.grandTotal.toFixed(2),
        },
        invoiceNumber,
        invoiceDate
    };
}
