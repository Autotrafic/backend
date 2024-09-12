import { NextFunction, Request, Response } from "express";
import parseOrderFromTotalum from "../parsers/order";
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

    const order = parseOrderFromTotalum(orderData);
    const client = parseClientFromPrimitive(partnerData ?? clientData);

    const invoiceNumber = updateInvoiceNumber(currentInvoiceNumber);
    const invoiceData = parseInvoiceData(
      order,
      client,
      invoiceNumber,
      isForClient
    );

    res.status(200).json(invoiceData);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error creating invoice data. \n ${error}`,
      `Error creating invoice data. \n ${error}`
    );
    next(finalError);
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

    const order = parseOrderFromTotalum(orderData);
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
      `Error updating invoice data. \n ${error}`
    );
    next(finalError);
  }
}
