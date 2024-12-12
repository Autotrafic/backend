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
  createPdfAsBase64,
  handleParcelUpdate,
  makeShipment,
  uploadMergedLabelsToDrive,
} from '../handlers/shipment';
import { catchControllerError } from '../../errors/generalError';
import { getExtendedShipmentById } from '../services/totalum';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { sleep } from '../../utils/funcs';

interface Progress {
  progress: number;
  total: number;
  message: string;
}

const progressMap: Record<string, Progress> = {};

export const getProgress = (req: Request, res: Response): void => {
  const { requestId } = req.query as { requestId: string };

  if (progressMap[requestId]) {
    res.json(progressMap[requestId]);
  } else {
    res.status(404).json({ message: 'Progress not found' });
  }
};

export async function makeMultipleShipments(
  req: MakeMultipleShipmentsImportBody,
  res: Response,
  next: NextFunction
): Promise<void> {
  const requestId = 'make_multiple_shipments';
  progressMap[requestId] = { progress: 0, total: 0, message: '' };

  try {
    // const { shipmentsId, isTest } = req.body;
    const shipmentsId = [
      '66f684b5cc39f4de7bc2683c',
      '66f686a67b135832f21902af',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9',
      '66f688db7b135832f21902b9'
    ];

    const shipmentsPromises = shipmentsId.map((shipmentId) => getExtendedShipmentById(shipmentId));
    const shipments = await Promise.all(shipmentsPromises);
    const cleanedShipments = shipments.filter((shipment) => shipment !== undefined);

    progressMap[requestId].total = cleanedShipments.length;

    checkEmptyShipments(cleanedShipments);

    const labelsBase64: string[] = [];

    for (let i = 0; i < cleanedShipments.length; i++) {
      const totalumShipment = cleanedShipments[i];

      try {
        // const label = await makeShipment({ totalumShipment, isTest });
        const label = await createPdfAsBase64('Here and now');
        labelsBase64.push(label);

        progressMap[requestId].progress = Math.round(((i + 1) / cleanedShipments.length) * 100);

        await sleep(500);
      } catch (error: any) {
        progressMap[requestId].message = `${error.message}. Body: ${JSON.stringify(req.body)}`;
      }
    }

    const mergedLabelsBase64 = await mergePdfFromBase64Strings(labelsBase64);
    // await uploadMergedLabelsToDrive(mergedLabelsBase64);

    res.status(200).json({ requestId, mergedLabelsBase64, message: progressMap[requestId].message });
  } catch (error: any) {
    progressMap[requestId].message = `Error making multiple shipments: ${error.message}`;
    catchControllerError(error.message, progressMap[requestId].message, req.body, next);
  } finally {
    delete progressMap[requestId];
  }
}

const temporaryStorage: Record<string, string[]> = {};

// Updated function
export async function makeMultipleShipmentss(
  req: MakeMultipleShipmentsImportBody,
  res: Response,
  next: NextFunction
): Promise<void> {
  const requestId = 'make_multiple_shipments';
  progressMap[requestId] = { progress: 0, total: 0, message: '' };

  try {
    const { shipmentsId, isLastBatch } = req.body;

    // Initialize storage for this request ID if it doesn't exist
    if (!temporaryStorage[requestId]) {
      temporaryStorage[requestId] = [];
    }

    const shipmentsPromises = shipmentsId.map((shipmentId) =>
      getExtendedShipmentById(shipmentId)
    );
    const shipments = await Promise.all(shipmentsPromises);
    const cleanedShipments = shipments.filter((shipment) => shipment !== undefined);

    checkEmptyShipments(cleanedShipments);

    for (let i = 0; i < cleanedShipments.length; i++) {
      const totalumShipment = cleanedShipments[i];

      try {
        const label = await createPdfAsBase64('Here and now');
        temporaryStorage[requestId].push(label);

        progressMap[requestId].progress = Math.round(
          ((i + 1) / cleanedShipments.length) * 100
        );

        await sleep(500);
      } catch (error: any) {
        progressMap[requestId].message = `${error.message}. Body: ${JSON.stringify(req.body)}`;
      }
    }

    if (isLastBatch) {
      // Merge all labels when processing the last batch
      const allLabelsBase64 = temporaryStorage[requestId];
      const mergedLabelsBase64 = await mergePdfFromBase64Strings(allLabelsBase64);

      // Cleanup storage for this request ID
      delete temporaryStorage[requestId];

      res.status(200).json({ requestId, mergedLabelsBase64, message: 'All shipments processed and merged.' });
    } else {
      res.status(200).json({ requestId, message: 'Batch processed successfully.' });
    }
  } catch (error: any) {
    progressMap[requestId].message = `Error making multiple shipments: ${error.message}`;
    catchControllerError(error.message, progressMap[requestId].message, req.body, next);
  } finally {
    delete progressMap[requestId];
  }
}


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
