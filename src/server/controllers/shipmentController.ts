import { NextFunction, Request, Response } from 'express';
import {
  CreateLabelImportBody,
  GetPdfLabelBody,
  HandleSendcloudWebhookBody,
  MakeMultipleShipmentsImportBody,
} from '../../interfaces/import/shipment';
import { parseTotalumShipment } from '../parsers/shipment';
import { requestSendcloudLabel, getSendcloudPdfLabel } from '../services/sendcloud';
import CustomError from '../../errors/CustomError';
import {
  checkEmptyShipments,
  checkShipmentsAvailability as checkTShipmentsAvailability,
  handleParcelUpdate,
  progressMap,
} from '../handlers/shipment';
import { catchControllerError } from '../../errors/generalError';
import { fetchAndCleanShipments, handleLastBatch, initializeRequestContext, processShipmentsBatch } from '../helpers/shipment';

export async function makeMultipleShipments(
  req: MakeMultipleShipmentsImportBody,
  res: Response,
  next: NextFunction
): Promise<void> {
  const { requestId, shipmentsId, numberOfShipments, isLastBatch, isTest } = req.body;

  try {
    initializeRequestContext(requestId, numberOfShipments);

    const cleanedShipments = await fetchAndCleanShipments(shipmentsId);
    checkEmptyShipments(cleanedShipments);

    await processShipmentsBatch(requestId, cleanedShipments, numberOfShipments, isTest);

    if (isLastBatch) {
      await handleLastBatch(requestId, res);
    } else {
      res.status(200).json({ requestId, message: 'Batch processed successfully.' });
    }
  } catch (error: any) {
    progressMap[requestId].message = `Error making multiple shipments: ${error.message}`;
    catchControllerError(error.message, progressMap[requestId].message, req.body, next);
  } finally {
    if (isLastBatch) delete progressMap[requestId];
  }
}

export const getProgress = (req: Request, res: Response): void => {
  const { requestId } = req.query as { requestId: string };

  if (progressMap[requestId]) {
    res.json(progressMap[requestId]);
  } else {
    res.status(404).json({ message: 'Progress not found' });
  }
};

export async function checkShipmentsAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const checks = await checkTShipmentsAvailability();

    res
      .status(200)
      .json({ success: false, message: 'Hay información pendiente de completar, revisa el Encabezado.', checks });
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

export async function handleSendcloudWebhook(req: HandleSendcloudWebhookBody, res: Response, next: NextFunction) {
  try {
    const updatedParcel = req.body;

    if (updatedParcel.action !== 'parcel_status_changed') {
      res.status(200).send('Webhook action type is not: parcel_status_changed');
      return;
    }

    const parcel = updatedParcel.parcel;

    await handleParcelUpdate(parcel);

    res.status(200).json({ message: 'Sendcloud webhook processed successfully' });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error handling sendcloud webhook.',
      `Error handling sendcloud webhook.
      ${error}.

      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
