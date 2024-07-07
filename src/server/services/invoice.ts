import { InvoiceService } from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import { SHIPMENT_COST, TAXES } from "../../utils/constants";

export function createInvoiceServicesList(
    currentInvoiceData: IOrder
): InvoiceService[] {
    const { type, itpPaid, totalInvoiced } = currentInvoiceData;

    const shipmentCost = SHIPMENT_COST;
    let taxValue: number;

    if (type === "Transferencia") {
        taxValue = TAXES.TRANSFERENCE;
    } else if (type === "Transferencia ciclomotor") {
        taxValue = TAXES.TRANSFERENCE_CICL;
    } else if (type === "Duplicado permiso") {
        taxValue = TAXES.PERMIT_DUPLICATE;
    } else if (type === "Distintivo") {
        taxValue = 0;
    } else if (type === "Notificacion") {
        taxValue = TAXES.NOTIFICATION;
    }

    const taxDGT = {
        description: "Tasa DGT",
        quantity: 1,
        priceWithoutIVA: "-" as "-",
        priceWithIVA: "-" as "-",
        totalPrice: taxValue,
    };

    const taxITP = itpPaid && {
        description: "Tasa ITP",
        quantity: 1,
        priceWithoutIVA: "-" as "-",
        priceWithIVA: "-" as "-",
        totalPrice: itpPaid,
    };

    const shipment = {
        description: "Envío",
        quantity: 1,
        priceWithoutIVA: "-" as "-",
        priceWithIVA: "-" as "-",
        totalPrice: shipmentCost,
    };

    const totalProfits =
        totalInvoiced -
        +(+taxDGT.totalPrice + (taxITP ? +taxITP.totalPrice : 0) + shipment.totalPrice);

    const profitsWithoutIVA = +totalProfits / 1.21;

    const profits = {
        description: "Honorarios",
        quantity: 1,
        priceWithoutIVA: profitsWithoutIVA,
        priceWithIVA: totalProfits,
        totalPrice: totalProfits,
    };

    return [taxDGT, taxITP, shipment, profits].filter(item => item !== null);
}

export function calculateInvoiceTotals(services: InvoiceService[]) {
    const totalIVA = services.reduce(
        (total, service) =>
            typeof service.priceWithIVA === "number"
                ? total + service.priceWithIVA
                : total,
        0
    );

    const grandTotal = services.reduce(
        (total, service) =>
            typeof service.totalPrice === "number"
                ? total + service.totalPrice
                : total,
        0
    );

    return { totalIVA, grandTotal };
}
