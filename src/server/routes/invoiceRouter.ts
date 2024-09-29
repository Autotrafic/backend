import express from "express";
import { createInvoiceData, generateMultipleInvoices, updateInvoiceData } from "../controllers/invoiceController";

const invoiceRouter = express.Router();

invoiceRouter.post("/create-data", createInvoiceData);
invoiceRouter.post("/update-data", updateInvoiceData);

invoiceRouter.post('/generate-from-multiple', generateMultipleInvoices);

export default invoiceRouter;