import { NextFunction, Request, Response } from 'express';
import { parseOrderFromTotalumToWeb } from '../parsers/order';
import parseClientFromPrimitive from '../parsers/client';
import {
  createInvoiceDataLogic,
  fetchInvoiceOptions,
  generateInvoiceBlob,
  generateMultipleInvoicesOptionsLogic,
} from '../services/invoice';
import parseInvoiceData from '../parsers/invoice';
import CustomError from '../../errors/CustomError';
import { bufferToBase64, mergePdfFromBase64Strings } from '../parsers/file';
import { TotalumOrder } from '../../interfaces/totalum/pedido';

export async function createInvoiceData(req: Request, res: Response, next: NextFunction) {
  try {
    const invoiceData = await createInvoiceDataLogic(req.body);

    res.status(200).json(invoiceData);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error creating invoice data.`,
      `Error creating invoice data.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function updateInvoiceData(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderData, clientData, currentInvoiceNumber, isForClient } = req.body;

    const order = parseOrderFromTotalumToWeb(orderData);
    const client = parseClientFromPrimitive(clientData);

    const invoiceData = parseInvoiceData(order, client, currentInvoiceNumber, isForClient);

    res.status(200).json(invoiceData);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error updating invoice data.',
      `Error updating invoice data.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function generateMultipleInvoicesPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const invoicesOptionsResult = await generateMultipleInvoicesOptionsLogic(req.body);

    if (!invoicesOptionsResult.success) {
      const { pdfWithErrors, message } = invoicesOptionsResult;
      res.json({ success: false, pdfWithErrors: pdfWithErrors, message: message });
      return;
    }

    const bufferRequests = invoicesOptionsResult.invoicesOptions.map((invoiceOption: any) =>
      generateInvoiceBlob(invoiceOption)
    );
    const invoicesBuffers = await Promise.all(bufferRequests);
    

    const invoicesBase64 = await Promise.all(invoicesBuffers.map(bufferToBase64));

    const mergedPdfBase64 = await mergePdfFromBase64Strings(invoicesBase64);

    res
      .status(201)
      .json({ success: true, mergedPdf: mergedPdfBase64, message: 'Se han generado las facturas correctamente' });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error generating invoices. ${error}`,
      `Error generating invoices.
      ${error}.`
    );
    next(finalError);
  }
}
