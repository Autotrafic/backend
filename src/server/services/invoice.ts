import { InternInvoiceService } from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import { SHIPMENT_COST, TAXES } from "../../utils/constants";

const ORDER_PROFITS = 15;

function getTaxValueFromOrderType(orderType: string) {
    let taxValue = 0;

    if (orderType === "Transferencia") {
        taxValue = TAXES.TRANSFERENCE;
    } else if (orderType === "Transferencia ciclomotor") {
        taxValue = TAXES.TRANSFERENCE_CICL;
    } else if (orderType === "Batecom") {
        taxValue = TAXES.BATECOM;
    } else if (orderType === "Entrega compraventa") {
        taxValue = TAXES.NOTIFICATION;
    } else if (orderType === "Transferencia por finalización entrega") {
        taxValue = TAXES.TRANSFERENCE;
    } else if (orderType === "Duplicado permiso") {
        taxValue = TAXES.PERMIT_DUPLICATE;
    } else if (orderType === "Distintivo") {
        taxValue = 0;
    } else if (orderType === "Notificacion") {
        taxValue = TAXES.NOTIFICATION;
    }

    return taxValue;
}

export function createInvoiceServicesListFromTotalInvoiced(
    currentInvoiceData: IOrder
): InternInvoiceService[] {
    const { type, itpPaid, totalInvoiced } = currentInvoiceData;

    const shipmentCost = SHIPMENT_COST;
    const taxValue = getTaxValueFromOrderType(type);

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

    const totalProfitsWithIVA =
        totalInvoiced -
        taxDGT.totalPrice -
        (taxITP ? taxITP.totalPrice : 0) -
        shipment.totalPrice;

    const IVAPrice = totalProfitsWithIVA * 0.21;

    const profitsWithoutIVA = totalProfitsWithIVA - IVAPrice;

    const profits = {
        description: "Honorarios",
        quantity: 1,
        priceWithoutIVA: profitsWithoutIVA,
        priceWithIVA: totalProfitsWithIVA,
        totalPrice: totalProfitsWithIVA,
    };

    return [taxDGT, taxITP, shipment, profits].filter((item) => item !== null);
}

export function createInvoiceServicesListFromProfits(
    currentInvoiceData: IOrder
): InternInvoiceService[] {
    const { type, itpPaid } = currentInvoiceData;

    const shipmentCost = SHIPMENT_COST;
    const taxValue = getTaxValueFromOrderType(type);

    if (!taxValue) throw new Error("The order type is not valid");

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

    const totalProfitsWithIVA = ORDER_PROFITS;

    const profitsWithoutIVA = (totalProfitsWithIVA * 100) / 121;

    const profits = {
        description: "Honorarios",
        quantity: 1,
        priceWithoutIVA: profitsWithoutIVA,
        priceWithIVA: totalProfitsWithIVA,
        totalPrice: totalProfitsWithIVA,
    };

    return [taxDGT, taxITP, shipment, profits].filter((item) => item !== null);
}

export function roundInvoiceServicesPrices(services: InternInvoiceService[]) {
    const roundedServices = services.map((service) => ({
        ...service,
        priceWithoutIVA:
            typeof service.priceWithoutIVA === "number"
                ? service.priceWithoutIVA.toFixed(2)
                : service.priceWithoutIVA,
        priceWithIVA:
            typeof service.priceWithIVA === "number"
                ? service.priceWithIVA.toFixed(2)
                : service.priceWithIVA,
        totalPrice: service.totalPrice.toFixed(2),
    }));

    return roundedServices;
}

export function calculateInvoiceTotals(services: InternInvoiceService[]) {
    const totalPriceWithIVA = services.reduce(
        (total, service) =>
            typeof service.priceWithIVA === "number"
                ? total + service.priceWithIVA
                : total,
        0
    );

    const totalPriceWithoutIVA = services.reduce(
        (total, service) =>
            typeof service.priceWithoutIVA === "number"
                ? total + service.priceWithoutIVA
                : total,
        0
    );

    const totalIVA = totalPriceWithIVA - totalPriceWithoutIVA;

    const grandTotal = services.reduce(
        (total, service) =>
            typeof service.totalPrice === "number"
                ? total + service.totalPrice
                : total,
        0
    );

    return { totalIVA, grandTotal };
}

export function updateInvoiceNumber(currentInvoiceNumber: number): number {
    return currentInvoiceNumber + 1;
}
