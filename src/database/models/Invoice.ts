export default interface Invoice {
    invoiceNumber?: number;
    invoiceDate?: string;
    client: InvoiceClient;
    services: InvoiceService[];
    summary: InvoiceSummary;
}

interface InvoiceClient {
    name: string;
    firstSurname: string;
    secondSurname: string;
    nif: string;
    email: string;
    phoneNumber: string;
}

export interface InvoiceService {
    description: string;
    quantity: number;
    priceWithoutIVA: number | "-";
    priceWithIVA: number | "-";
    totalPrice: number;
}

interface InvoiceSummary {
    discount?: number;
    subtotal?: number;
    totalIVA: number;
    grandTotal: number;
}
