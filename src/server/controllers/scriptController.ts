import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import CustomError from '../../errors/CustomError';
import sseClientManager from '../../sse/sseClientManager';
import { getExtendedOrderById } from '../services/totalum';
import { generateTextByOrderFailedChecks } from '../handlers/order';
import { searchRegexInWhatsappChat } from '../services/notifier';

const totalumSdk = new TotalumApiSdk(totalumOptions);

interface Order extends TotalumOrder {
  socio_profesional: string;
}

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const response = await totalumSdk.crud.getItemById('cliente', '673ef347d0463eb19af3e501');

  const client = response.data.data;

    res.status(200).json({ client });
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
