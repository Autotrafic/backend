import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import {
  getActualTrimesterExtendedOrders,
  getAllPendingTasks,
  getExtendedOrders,
  getOrderById,
  getOrdersPendingToShip,
  getShipmentByOrderId,
} from '../services/totalum';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import fetch from 'node-fetch';
import CustomError from '../../errors/CustomError';
import { TCheck, TOTALUM_CHECKS } from '../../interfaces/checks';
import { addCheckToList } from '../../utils/funcs';
import { checkShipmentAvailability } from '../handlers/checks';
import sseClientManager from '../../sse/sseClientManager';
import { shortUrl } from '../services/other';
import axios from 'axios';
import { makeShipment, uploadMergedLabelsToDrive } from '../handlers/shipment';
import { mergePdfFromBase64Strings } from '../parsers/file';
import { requestShortenUrl } from '../services';

const totalumSdk = new TotalumApiSdk(totalumOptions);

interface Order extends TotalumOrder {
  socio_profesional: string;
}

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const shipment = await getShipmentByOrderId('66d878aeda4ce6eed929dbaa');

    res.status(200).json({ shipment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}

export async function runSecondScript(req: Request, res: Response, next: NextFunction) {
  try {
    const message = 'Thisis fucking awesome';

    sseClientManager.broadcast('data', { text: message });

    res.status(200).send('Message broadcasted to all connected clients');
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error generating invoices.',
      `Error generating invoices.
      ${error}.`
    );
    next(finalError);
  }
}
