import { NextFunction, Request, Response } from 'express';
import { CreateLabelImportBody, GetPdfLabelBody, MakeMultipleShipmentsImportBody } from '../../interfaces/import/shipment';
import { parseTotalumShipment } from '../parsers/shipment';
import { requestSendcloudLabel, getSendcloudPdfLabel } from '../services/sendcloud';
import CustomError from '../../errors/CustomError';
import { makeShipment, uploadMergedLabelsToDrive } from '../handlers/shipment';
import { catchControllerError } from '../../errors/generalError';
import { getShipmentByOrderId } from '../services/totalum';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { checkShipmentAvailability } from '../handlers/checks';

export async function makeMultipleShipments(req: MakeMultipleShipmentsImportBody, res: Response, next: NextFunction) {
  try {
    const { ordersId, isTest } = req.body;

    const shipmentsPromises = ordersId.map((plate) => getShipmentByOrderId(plate));
    const shipments = await Promise.all(shipmentsPromises);

    const labelsPromises = shipments.map((totalumShipment) => makeShipment({ totalumShipment, isTest }));
    const labelsBase64 = await Promise.all(labelsPromises);

    const mergedLabelsBase64 = await mergePdfFromBase64Strings(labelsBase64);
    await uploadMergedLabelsToDrive(mergedLabelsBase64);

    res.status(200).json({ mergedLabelsBase64 });
  } catch (error) {
    catchControllerError(error.message, `Error making multiple shipments ${error.message}`, req.body, next);
  }
}

export async function checkShipmentsAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const checks = await checkShipmentAvailability();

    if (checks.length > 0) {
      res
        .status(200)
        .json({ success: false, message: 'Hay información pendiente de completar, revisa el Encabezado.', checks });
      return;
    }

    res.status(200).json(checks);
  } catch (error) {
    catchControllerError(error, 'Error checking shipments availability', req.body, next);
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
