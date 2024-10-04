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
import axios from 'axios';

const totalumSdk = new TotalumApiSdk(totalumOptions);

interface Order extends TotalumOrder {
  socio_profesional: string;
}

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
   const WHATSAPP_API_URL = 'https://autotrafic-whatsapp-d396136eabe5.herokuapp.com/messages/send';

   const options = {
    phoneNumber: "34674218987",
    message: 'TEst'
   }

   const result = await axios.post(WHATSAPP_API_URL, options);

    res.status(200).json(result.data);
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
