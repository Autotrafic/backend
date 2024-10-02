import { NextFunction, Response } from 'express';
import { CreateLabelImportBody, GetPdfLabelBody } from '../../interfaces/import/shipment';
import { parseTotalumShipment } from '../parsers/shipment';
import { requestSendcloudLabel, getSendcloudPdfLabel } from '../services/sendcloud';
import CustomError from '../../errors/CustomError';
import { createSendcloudLabel } from '../handlers/shipment';
import { catchControllerError } from '../../errors/generalError';
import { SENDCLOUD_SHIP_STATUS } from '../../interfaces/enums';
import { checkShipmentAvailability } from '../handlers/checks';
import sseClientManager from '../../sse/sseClientManager';

export async function makeMultipleShipments(req: CreateLabelImportBody, res: Response, next: NextFunction) {
  // try {
  //   const ordersForShip = await createSendcloudLabel(req.body);

  //   const parcelId = parcel.id;

  //   if (parcel.status.id !== SENDCLOUD_SHIP_STATUS.READY_TO_SEND.id) {
  //     res.status(200).json({ success: false, message: 'No se ha podido generar la etiqueta. Contacta con soporte.' });
  //     return;
  //   }

  //   const pdfLabelBuffer = await getSendcloudPdfLabel(parcelId);

  //   const labelBase64 = Buffer.from(pdfLabelBuffer).toString('base64');

  //   res.status(201).json({ labelBase64, success: true, message: 'Se ha generado la etiqueta correctamente' });
  // } catch (error) {
  //   catchControllerError(error, 'Error making shipment', req.body, next);
  // }
}

export async function createLabel(req: CreateLabelImportBody, res: Response, next: NextFunction) {
  try {
    const { totalumShipment, isTest } = req.body;

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
