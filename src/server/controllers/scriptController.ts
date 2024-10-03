import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import {
  getActualTrimesterExtendedOrders,
  getExtendedOrders,
  getOrderById,
  getOrdersPendingToShip,
} from '../services/totalum';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import fetch from 'node-fetch';
import CustomError from '../../errors/CustomError';
import { TCheck, TOTALUM_CHECKS } from '../../interfaces/checks';
import { addCheckToList } from '../../utils/funcs';
import { checkShipmentAvailability } from '../handlers/checks';
import sseClientManager from '../../sse/sseClientManager';
import { shortUrl } from '../services/other';

const totalumSdk = new TotalumApiSdk(totalumOptions);

interface Order extends TotalumOrder {
  socio_profesional: string;
}

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const url = await shortUrl('https://tracking.eu-central-1-0.sendcloud.sc/forward?carrier=correos_express&code=3230007909971066&destination=ES&lang=es-es&source=ES&type=parcel&verification=13005&servicepoint_verification=&shipping_product_code=correos_express%3Apaq24&created_at=2024-10-03');


    res.status(200).json(url);
  } catch (error) {
    console.error(error);
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
