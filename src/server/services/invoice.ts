/* eslint-disable no-else-return */
import { InternInvoiceService } from "../../database/models/Invoice";
import { IOrder } from "../../database/models/Order/Order";
import { SHIPMENT_COST, ORDER_TYPES } from "../../utils/constants";

const ORDER_PROFITS = 15;

function getOrderTypeDetails(orderType: string) {
    let taxValue = null;
    let hasShipmentCost = null;

    if (orderType === "Transferencia") {
        taxValue = ORDER_TYPES.TRANSFERENCE.taxValue;
        hasShipmentCost = ORDER_TYPES.TRANSFERENCE.hasShipment;
    } else if (orderType === "Transferencia ciclomotor") {
        taxValue = ORDER_TYPES.TRANSFERENCE_CICL.taxValue;
        hasShipmentCost = ORDER_TYPES.TRANSFERENCE_CICL.hasShipment;
    } else if (orderType === "Entrega compraventa") {
        taxValue = ORDER_TYPES.NOTIFICATION.taxValue;
        hasShipmentCost = ORDER_TYPES.NOTIFICATION.hasShipment;
    } else if (orderType === "Transferencia por finalizacion entrega") {
        taxValue = ORDER_TYPES.TRANSFERENCE.taxValue;
        hasShipmentCost = ORDER_TYPES.TRANSFERENCE.hasShipment;
    } else if (orderType === "Duplicado permiso") {
        taxValue = ORDER_TYPES.PERMIT_DUPLICATE.taxValue;
        hasShipmentCost = ORDER_TYPES.PERMIT_DUPLICATE.hasShipment;
    } else if (orderType === "Distintivo") {
        taxValue = ORDER_TYPES.DISTINCTIVE.taxValue;
        hasShipmentCost = ORDER_TYPES.DISTINCTIVE.hasShipment;
    } else if (orderType === "Notificacion") {
        taxValue = ORDER_TYPES.NOTIFICATION.taxValue;
        hasShipmentCost = ORDER_TYPES.NOTIFICATION.hasShipment;
    }

    if (taxValue === null || hasShipmentCost === null)
        throw new Error("The order type is not valid");

    return { taxValue, hasShipmentCost };
}

export function createInvoiceServicesList(
    currentInvoiceData: IOrder,
    isForClient: boolean
): InternInvoiceService[] {
    const { type, itpPaid, totalInvoiced } = currentInvoiceData;

    const { taxValue, hasShipmentCost } = getOrderTypeDetails(type);
    const shipmentCost = SHIPMENT_COST;

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

    const shipment = hasShipmentCost
        ? {
              description: "Envío",
              quantity: 1,
              priceWithoutIVA: "-" as "-",
              priceWithIVA: "-" as "-",
              totalPrice: shipmentCost,
          }
        : null;

    let totalProfitsWithIVA: number;

    if (isForClient) {
        totalProfitsWithIVA =
            totalInvoiced -
            taxDGT.totalPrice -
            (taxITP ? taxITP.totalPrice : 0) -
            (shipment ? shipment.totalPrice : 0);
    } else {
        totalProfitsWithIVA = ORDER_PROFITS;
    }

    const profitsWithoutIVA = (totalProfitsWithIVA * 100) / 121;

    const profits = {
        description: "Honorarios",
        quantity: 1,
        priceWithoutIVA: profitsWithoutIVA,
        priceWithIVA: totalProfitsWithIVA,
        totalPrice: totalProfitsWithIVA,
    };

    const servicesList = [taxDGT, taxITP, shipment, profits].filter(
        (item) => item !== null && item !== undefined
    );

    return servicesList;
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
