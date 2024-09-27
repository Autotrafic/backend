import { NextFunction, Response } from "express";
import { CreateLabelImportBody } from "../../interfaces/import/shipment";
import { parseTotalumShipment } from "../parsers/shipment";
import { createSendcloudLabel } from "../services/sendcloud";
import CustomError from "../../errors/CustomError";

export async function createLabel(
  req: CreateLabelImportBody,
  res: Response,
  next: NextFunction
) {
  try {
    const { totalumShipment } = req.body;

    const shipment = parseTotalumShipment(totalumShipment);

    await createSendcloudLabel(shipment);

    res.status(200).json({ message: "Sendcloud label created successfully" });
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
