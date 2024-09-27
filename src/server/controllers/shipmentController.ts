import { NextFunction, Response } from "express";
import {
  CreateLabelImportBody,
  GetPdfLabelBody,
} from "../../interfaces/import/shipment";
import { parseTotalumShipment } from "../parsers/shipment";
import {
  createSendcloudLabel,
  getSendcloudPdfLabel,
} from "../services/sendcloud";
import CustomError from "../../errors/CustomError";

export async function createLabel(
  req: CreateLabelImportBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { totalumShipment, isTest } = req.body;

    const shipment = parseTotalumShipment(totalumShipment);

    const label = await createSendcloudLabel(shipment, isTest);

    res
      .status(200)
      .json({ message: "Sendcloud label created successfully", label });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error creating sendcloud label.",
      `Error creating sendcloud label.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function getPdfLabel(
  req: GetPdfLabelBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { parcelId, startFrom = 0 } = req.body;

    const pdfLabel = await getSendcloudPdfLabel(parcelId, startFrom);

    res.setHeader("Content-Type", "application/pdf");

    res.status(200).send(pdfLabel);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      "Error creating sendcloud label.",
      `Error creating sendcloud label.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
