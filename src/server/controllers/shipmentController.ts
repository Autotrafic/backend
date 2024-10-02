import { NextFunction, Response } from 'express';
import { CreateLabelImportBody, GetPdfLabelBody, MakeMultipleShipmentsImportBody } from '../../interfaces/import/shipment';
import { parseTotalumShipment } from '../parsers/shipment';
import { requestSendcloudLabel, getSendcloudPdfLabel } from '../services/sendcloud';
import CustomError from '../../errors/CustomError';
import { makeShipment } from '../handlers/shipment';
import { catchControllerError } from '../../errors/generalError';
import { getShipmentByVehiclePlate } from '../services/totalum';
import { mergePdfFromBase64Strings } from '../parsers/file';

export async function makeMultipleShipments(req: MakeMultipleShipmentsImportBody, res: Response, next: NextFunction) {
  try {
    const { vehiclePlates, isTest } = req.body;

    const shipmentsPromises = vehiclePlates.map((plate) => getShipmentByVehiclePlate(plate));
    const shipments = await Promise.all(shipmentsPromises);

    const labelsPromises = shipments.map((totalumShipment) => makeShipment({ totalumShipment, isTest }));
    const labelsBase64 = await Promise.all(labelsPromises);

    const mergedLabelsBase64 = await mergePdfFromBase64Strings(labelsBase64);

    res.status(200).json(mergedLabelsBase64);
  } catch (error) {
    catchControllerError(error, 'Error making multiple shipments', req.body, next);
  }
}

export async function createLabel(req: CreateLabelImportBody, res: Response, next: NextFunction) {
  try {
    const { totalumShipment: totalumShipment, isTest } = req.body;

    const shipment = parseTotalumShipment(totalumShipment);

    const label = await requestSendcloudLabel(shipment, isTest);

    res.status(200).json({ message: 'Sendcloud label created successfully', label });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error creating sendcloud label.',
      `Error creating sendcloud label.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function getPdfLabel(req: GetPdfLabelBody, res: Response, next: NextFunction) {
  try {
    const { parcelId } = req.body;

    const pdfLabel = await getSendcloudPdfLabel(parcelId);

    res.setHeader('Content-Type', 'application/pdf');

    res.status(200).send(pdfLabel);
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error creating sendcloud label.',
      `Error creating sendcloud label.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
