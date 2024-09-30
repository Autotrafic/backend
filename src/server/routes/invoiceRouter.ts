import express from 'express';
import { createInvoiceData, generateMultipleInvoicesPdf, updateInvoiceData } from '../controllers/invoiceController';

const invoiceRouter = express.Router();

invoiceRouter.post('/create-data', createInvoiceData);
invoiceRouter.post('/update-data', updateInvoiceData);

invoiceRouter.post('/generate-from-multiple', generateMultipleInvoicesPdf);

export default invoiceRouter;
