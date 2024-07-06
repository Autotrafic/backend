import { SHIPMENT_COST, TAXES } from "../../utils/constants";

interface CurrentInvoiceData {
    tipo: string;
    itp_pagado: number;
    total_facturado: number;
}

export function createInvoiceServicesList(
    currentInvoiceData: CurrentInvoiceData
) {
    const {
        tipo,
        itp_pagado: itpValue,
        total_facturado: totalInvoiced,
    } = currentInvoiceData;

    const shipmentCost = SHIPMENT_COST;
    let taxValue: number;

    if (tipo === "Transferencia") {
        taxValue = TAXES.TRANSFERENCE;
    } else if (tipo === "Transferencia ciclomotor") {
        taxValue = TAXES.TRANSFERENCE_CICL;
    } else if (tipo === "Duplicado permiso") {
        taxValue = TAXES.PERMIT_DUPLICATE;
    } else if (tipo === "Distintivo") {
        taxValue = 0;
    } else if (tipo === "Notificacion") {
        taxValue = TAXES.NOTIFICATION;
    }

    const taxDGT = {
        description: "Tasa DGT",
        quantity: "1",
        priceWithoutIVA: "-",
        priceWithIVA: "-",
        totalPrice: `${taxValue}`,
    };

    const taxITP = itpValue && {
        description: "Tasa ITP",
        quantity: "1",
        priceWithoutIVA: "-",
        priceWithIVA: "-",
        totalPrice: `${itpValue}`,
    };

    const shipment = {
        description: "Envío",
        quantity: "1",
        priceWithoutIVA: "-",
        priceWithIVA: "-",
        totalPrice: `${shipmentCost}`,
    };

    const totalProfits =
        totalInvoiced -
        +(+taxDGT.totalPrice + (+taxITP.totalPrice ?? 0) + shipment.totalPrice);

    const profitsWithoutIVA = +totalProfits / 1.21;

    const profits = {
        description: "Honorarios",
        quantity: "1",
        priceWithoutIVA: `${profitsWithoutIVA}`,
        priceWithIVA: `${totalProfits}`,
    };

    return [taxDGT, taxITP, shipment, profits];
}

// export function parseInvoiceData(orderData, clientData) {}
