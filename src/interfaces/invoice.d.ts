import Invoice from '../database/models/Invoice';
import { TotalumOrder } from './totalum/pedido';

interface InvoiceOptions {
  invoiceData: Invoice;
  invoiceNumber: number;
  orderDataId: string;
}

interface InvoiceSuccessOptions {
  success: true;
  invoicesOptions: InvoiceOptions[];
}

interface InvoiceErrorOptions {
  success: false;
  message: 'No se han podido generar las facturas. Se ha descargado un PDF con los errores.';
  pdfWithErrors: string;
}

interface InvoicePrimitiveOptions {
  orderData: TotalumOrder;
  clientData: TClient;
  invoiceNumber: number;
  isForClient: boolean;
}