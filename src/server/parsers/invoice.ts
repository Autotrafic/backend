import Client from "../../database/models/Client/Client";
import Invoice from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import {
    createInvoiceServicesList,
    calculateInvoiceTotals,
} from "../services/invoice";

export default function parseInvoiceData(
    order: IOrder,
    client: Client
): Invoice {
    const servicesList = createInvoiceServicesList(order);
    const totals = calculateInvoiceTotals(servicesList);

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
            totalIVA: totals.totalIVA,
            grandTotal: totals.grandTotal,
        },
    };
}
