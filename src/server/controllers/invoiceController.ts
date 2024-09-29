import { NextFunction, Request, Response } from "express";
import { parseOrderFromTotalumToWeb } from "../parsers/order";
import parseClientFromPrimitive from "../parsers/client";
import { updateInvoiceNumber } from "../services/invoice";
import parseInvoiceData from "../parsers/invoice";
import CustomError from "../../errors/CustomError";

export async function createInvoiceData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const {
      orderData,
      clientData,
      partnerData,
      currentInvoiceNumber,
      isForClient,
    } = req.body;

    const order = parseOrderFromTotalumToWeb(orderData);
    const client = parseClientFromPrimitive(partnerData ?? clientData);

    if ((!client && !order.shipmentAddress) || (!client.address && !order.shipmentAddress)) {
      res.status(400).send(`${order.vehiclePlate} no contiene direccion para generar la factura.`);
      return;
    }

    const invoiceNumber = updateInvoiceNumber(currentInvoiceNumber);
    const invoiceData = parseInvoiceData(
      order,
      client,
      invoiceNumber,
      isForClient
    );

    res.status(200).json(invoiceData);

    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error creating invoice data.`,
      `Error creating invoice data.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    // next(finalError);
  }
}

export async function updateInvoiceData(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { orderData, clientData, currentInvoiceNumber, isForClient } =
      req.body;

    const order = parseOrderFromTotalumToWeb(orderData);
    const client = parseClientFromPrimitive(clientData);

    const invoiceData = parseInvoiceData(
      order,
      client,
      currentInvoiceNumber,
      isForClient
    );

    res.status(200).json(invoiceData);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error updating invoice data.",
      `Error updating invoice data.
      ${error}.
      
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
