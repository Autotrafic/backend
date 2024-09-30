import { NextFunction, Request, Response } from 'express';
import { parseOrderFromTotalumToWeb } from '../parsers/order';
import parseClientFromPrimitive from '../parsers/client';
import { updateInvoiceNumber } from '../services/invoice';
import parseInvoiceData from '../parsers/invoice';
import CustomError from '../../errors/CustomError';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import fetch from 'node-fetch';
import { PDFDocument } from 'pdf-lib';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function createInvoiceData(req: Request, res: Response, next: NextFunction) {
  try {
    const { orderData, clientData, partnerData, currentInvoiceNumber, isForClient } = req.body;

    const order = parseOrderFromTotalumToWeb(orderData);
    const client = parseClientFromPrimitive(partnerData ?? clientData);

    if (!client) {
      res.status(400).send(`${order.vehiclePlate} no contiene cliente o socio profesional para generar la factura.`);
      return;
    }

    if (!client.address && !order.shipmentAddress) {
      res.status(400).send(`${order.vehiclePlate} no contiene direccion para generar la factura.`);
      return;
    }

    const invoiceNumber = updateInvoiceNumber(currentInvoiceNumber);
    const invoiceData = parseInvoiceData(order, client, invoiceNumber, isForClient);

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

export async function generateMultipleInvoices(req: Request, res: Response, next: NextFunction) {
  const invoiceTemplateId = '668555647039d527e634233d';

  async function generateInvoiceBlob({ invoiceData, orderDataId }: { invoiceData: any; orderDataId: any }) {
    try {
      const fileName = `factura-${invoiceData.invoiceNumber}.pdf`;

      const file = await totalumSdk.files.generatePdfByTemplate(invoiceTemplateId, invoiceData, fileName);

      await totalumSdk.crud.editItemById('pedido', orderDataId, {
        factura: { name: fileName },
      });

      const response = await fetch(file.data.data.url);
      const buffer = await response.buffer();
      return buffer;
    } catch (error) {
      throw new Error(`Error creating Totalum invoice.
        Order id: ${orderDataId}
        Invoice data: ${JSON.stringify(invoiceData)}
        Error: ${error}`);
    }
  }

  async function bufferToBase64(buffer: Buffer) {
    return buffer.toString('base64');
  }

  try {
    const { invoiceOptions } = req.body;

    const bufferRequests = invoiceOptions.map((invoiceOption: any) => generateInvoiceBlob(invoiceOption));
    const invoiceBuffers = await Promise.all(bufferRequests);

    const invoiceBase64Strings = await Promise.all(invoiceBuffers.map(bufferToBase64));

    const mergedPdf = await PDFDocument.create();

    for (const base64String of invoiceBase64Strings) {
      const pdfBytes = Buffer.from(base64String, 'base64');
      const pdf = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page);
      });
    }

    const mergedPdfBytes = await mergedPdf.save();

    const mergedPdfBase64 = Buffer.from(mergedPdfBytes).toString('base64');

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
