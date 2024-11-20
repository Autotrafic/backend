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
    const message = `👋 Muy buenas, *Fernando Gabriel Gauna*

📦 Se entregará el nuevo permiso de circulación con matrícula *0361HSZ*

👨🏻‍✈️ El mensajero ya está de camino a su domicilio

🏠 Entre hoy y mañana tocará a su puerta`;

    const alreadySent = await searchRegexInWhatsappChat('34622599876', message);

    res.status(200).json({ alreadySent });
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
