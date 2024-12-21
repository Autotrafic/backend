import '../loadEnvironment';
import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import CustomError from './CustomError';
import notifySlack from '../server/services/notifier';
import { parseStripeError } from '../server/parsers/other';

export const notFoundError = (req: Request, res: Response) => {
  res.statusCode = 404;
  res.json({ error: 'Oops! Page not found :(' });
};

export const generalError = (error: CustomError, req: Request, res: Response, next: NextFunction) => {
  const errorCode = error.statusCode ?? 500;

  console.log(chalk.bgRed.white(error.message));

  notifySlack(error.privateMessage);

  res.status(errorCode).json({ error: error.privateMessage, publicMessage: error.publicMessage });
};

export function catchControllerError(
  error: any,
  message: string,
  requestBody: any,
  nextFunction: NextFunction,
  errorCode: number = 500,
) {
  const finalError = new CustomError(
    errorCode,
    `${error?.publicMessage ?? `${message}: ${error.message}`}`,
    `${message}: ${error.message}
    
----------------------------------------------

    Body: ${JSON.stringify(requestBody)}`
  );
  nextFunction(finalError);
}

export function handleStripeError(error: any) {
  if (error && error.type) {
    console.error('Stripe error:', error.message);

    const stripeError = {
      type: error.type,
      code: error.code,
      message: error.message,
    };

    notifySlack(`Stripe error: ${JSON.stringify(stripeError)}`);
    const parsedError = parseStripeError(stripeError);

    throw parsedError;
  } else {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
}
