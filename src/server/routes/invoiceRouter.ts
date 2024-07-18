import express from "express";
import { createInvoiceData, updateInvoiceData } from "../controllers/invoiceController";

const invoiceRouter = express.Router();

invoiceRouter.post("/create-data", createInvoiceData);
invoiceRouter.post("/update-data", updateInvoiceData);

export default invoiceRouter;