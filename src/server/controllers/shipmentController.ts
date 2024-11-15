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
import { checkEmptyShipments, checkShipmentAvailability, handleParcelUpdate, makeShipment, uploadMergedLabelsToDrive } from '../handlers/shipment';
import { catchControllerError } from '../../errors/generalError';
import { getShipmentByOrderId } from '../services/totalum';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { sleep } from '../../utils/funcs';

export async function makeMultipleShipments(req: MakeMultipleShipmentsImportBody, res: Response, next: NextFunction) {
  try {
    const { ordersId, isTest } = req.body;

    const shipmentsPromises = ordersId.map((plate) => getShipmentByOrderId(plate));
    const shipments = await Promise.all(shipmentsPromises);
    const cleanedShipments = shipments.filter((shipment) => shipment !== undefined);

    checkEmptyShipments(cleanedShipments);

    let labelsBase64 = [];
    let message = '';
    for (let totalumShipment of cleanedShipments) {
      try {
        const ones = await makeShipment({ totalumShipment, isTest });
        labelsBase64.push(ones);

        sleep(500);
      } catch (error) {
        message = `${error.message}. Body: ${JSON.stringify(req.body)}`;
      }
    }

    const mergedLabelsBase64 = await mergePdfFromBase64Strings(labelsBase64);
    await uploadMergedLabelsToDrive(mergedLabelsBase64);

    res.status(200).json({ mergedLabelsBase64, message });
  } catch (error) {
    catchControllerError(error.message, `Error making multiple shipments ${error.message}`, req.body, next);
  }
}

export async function checkShipmentsAvailability(req: Request, res: Response, next: NextFunction) {
  try {
    const checks = await checkShipmentAvailability();

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
