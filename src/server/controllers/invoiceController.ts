import { NextFunction, Request, Response } from 'express';
import { parseOrderFromTotalumToWeb } from '../parsers/order';
import parseClientFromPrimitive from '../parsers/client';
import { createInvoiceDataLogic, generateInvoicesBase64, generateMultipleInvoicesOptionsLogic } from '../services/invoice';
import parseInvoiceData from '../parsers/invoice';
import CustomError from '../../errors/CustomError';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { catchControllerError } from '../../errors/generalError';

export async function generateMultipleInvoicesPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const invoicesOptionsResult = await generateMultipleInvoicesOptionsLogic(req.body);

    if (invoicesOptionsResult.success === false) {
      const { pdfWithErrors, message } = invoicesOptionsResult;
      res.json({ success: false, pdfWithErrors: pdfWithErrors, message: message });
      return;
    }

    const invoicesBase64 = await generateInvoicesBase64(invoicesOptionsResult.invoicesOptions);

    const mergedPdfBase64 = await mergePdfFromBase64Strings(invoicesBase64);

    res
      .status(201)
      .json({ success: true, mergedPdf: mergedPdfBase64, message: 'Se han generado las facturas correctamente' });
  } catch (error) {
    catchControllerError(error, 'Error generating invoices', req.body, next);
  }
}

export async function createInvoiceData(req: Request, res: Response, next: NextFunction) {
  try {
    const invoiceData = await createInvoiceDataLogic(req.body);

    res.status(200).json(invoiceData);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error creating invoice data. ${error}`,
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
