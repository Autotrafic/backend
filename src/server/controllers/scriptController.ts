import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import { TotalumOrder } from '../../interfaces/totalum/pedido';
import CustomError from '../../errors/CustomError';
import sseClientManager from '../../sse/sseClientManager';
import { createUser, getUserByPhoneNumber, updateUserByPhoneNumber } from '../../database/repository/user';
import { createStripePaymentIntent } from '../services/stripe';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {
  const CURRENCY = 'eur';

  const amount = 14675;
  const userData = { fullName: '1', email: '1', phoneNumber: '1' };

  const { fullName, phoneNumber, email } = userData;

  try {
    let user = await getUserByPhoneNumber(phoneNumber);

    if (!user) {
      user = await createUser(fullName, phoneNumber, email);
    } else {
      const updatedUser = {
        fullName,
        phoneNumber,
        email: user.email,
        stripeId: user.stripeId,
      };
      await updateUserByPhoneNumber(updatedUser);
    }

    const paymentIntent = await createStripePaymentIntent({
      paymentMethods: ['card', 'link'],
      automaticPaymentMethods: { enabled: true },
      amount,
      currency: CURRENCY,
      customer: user.stripeId,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
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
