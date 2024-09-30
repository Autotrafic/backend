import { NextFunction, Request, Response } from 'express';
import { parseOrderFromTotalumToWeb } from '../parsers/order';
import parseClientFromPrimitive from '../parsers/client';
import { createInvoiceDataLogic, fetchInvoiceOptions, generateInvoiceBlob } from '../services/invoice';
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

export async function generateMultipleInvoicesOptions(req: Request, res: Response, next: NextFunction) {
  const { allOrders: orders } = req.body;

  try {
    if (orders.length > 20) {
      throw new Error('Selecciona la opción de mostrar 20 pedidos por página, como máximo');
    }

    const optionRequests = orders.map((order: TotalumOrder) => fetchInvoiceOptions(order));
    const invoiceOptions = await Promise.all(optionRequests);

    const errors = invoiceOptions.filter((option) => typeof option === 'string').join('\n');

    if (errors.length > 0) {
      try {
        res.status(400).json({
          message: 'No se han podido generar las facturas. Se ha descargado un PDF con los errores.',
          errors: errors,
        });
        return;
      } catch {
        throw new Error(
          'No se han podido generar las facturas. Hay errores y no se ha podido descargar el archivo que los contiene'
        );
      }
    }

    res.status(201).json({ invoicesOptions: invoiceOptions });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error generating invoices options.',
      `Error generating invoices options.
      ${error}.`
    );
    next(finalError);
  }
}

export async function generateMultipleInvoicesPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const { invoicesOptions } = req.body;

    const bufferRequests = invoicesOptions.map((invoiceOption: any) => generateInvoiceBlob(invoiceOption));
    const invoiceBuffers = await Promise.all(bufferRequests);

    const invoiceBase64Strings = await Promise.all(invoiceBuffers.map(bufferToBase64));

    const mergedPdfBase64 = await mergePdfFromBase64Strings(invoiceBase64Strings);

    res.status(201).json({ mergedPdf: mergedPdfBase64 });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error generating invoices.',
      `Error generating invoices.
      ${error}.`
    );
    next(finalError);
  }
}
