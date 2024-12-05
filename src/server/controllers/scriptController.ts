import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import CustomError from '../../errors/CustomError';
import sseClientManager from '../../sse/sseClientManager';
import { createUser, getUserByPhoneNumber, updateUserByPhoneNumber } from '../../database/repository/user';
import { createStripePaymentIntent } from '../services/stripe';
import { getExtendedShipmentById } from '../services/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {

  try {
    const shipment = await getExtendedShipmentById('67483ee871bb782fa03c7b92');

    res.status(200).json({shipment});
  } catch (error) {
    console.error('Error processing the file:', error.message);
    res.status(500).send('Error processing the file');
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
