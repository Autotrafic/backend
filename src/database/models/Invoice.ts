interface InvoiceOrder {
    type: string;
    vehiclePlate: string;
}

interface InvoiceClient {
    name: string;
    firstSurname: string;
    secondSurname: string;
    nif: string;
    email: string;
    phoneNumber: string;
}

export default interface Invoice {
    invoiceNumber: string;
    invoiceDate: string;
    order: InvoiceOrder;
    client: InvoiceClient;
    services: InvoiceService[];
    summary: InvoiceSummary;
}

export interface InvoiceService {
    description: string;
    quantity: number;
    priceWithoutIVA: string;
    priceWithIVA: string;
    totalPrice: string;
}

export interface InternInvoiceService {
    description: string;
    quantity: number;
    priceWithoutIVA: number | "-";
    priceWithIVA: number | "-";
    totalPrice: number;
}

interface InvoiceSummary {
    discount?: string;
    subtotal?: string;
    totalIVA: string;
    grandTotal: string;
}
