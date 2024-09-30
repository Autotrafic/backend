import express from 'express';
import { createInvoiceData, generateMultipleInvoicesOptions, generateMultipleInvoicesPdf, updateInvoiceData } from '../controllers/invoiceController';

const invoiceRouter = express.Router();

invoiceRouter.post('/create-data', createInvoiceData);
invoiceRouter.post('/update-data', updateInvoiceData);

invoiceRouter.post('/generate-multiple-invoices-options', generateMultipleInvoicesOptions);
invoiceRouter.post('/generate-multiple-invoices-pdf', generateMultipleInvoicesPdf);

export default invoiceRouter;
