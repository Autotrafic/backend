import '../loadEnvironment';
import chalk from 'chalk';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import CustomError from './CustomError';
import notifySlack from '../server/services/notifier';

export const notFoundError = (req: Request, res: Response) => {
  res.statusCode = 404;
  res.json({ error: 'Oops! Page not found :(' });
};

export const generalError = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let errorCode;
  let errorMessage;

  if (error instanceof ValidationError) {
    console.log(chalk.red('Request validation errors: '));
    error.details.body.forEach((errorInfo) => {
      console.log(chalk.red(errorInfo.message));
    });

    errorCode = error.statusCode;
    errorMessage = 'Wrong data';
  } else {
    errorCode = error.statusCode ?? 500;
    errorMessage = error.publicMessage ?? 'Something went wrong';

    console.log(chalk.bgRed.white(error.message));
  }

  notifySlack(error.privateMessage);

  res.statusCode = errorCode;
  res.json({ error: errorMessage });
};

export function catchControllerError(
  error: any,
  message: string,
  requestBody: any,
  nextFunction: NextFunction,
  errorCode: number = 400
) {
  console.log(error);
  const finalError = new CustomError(
    errorCode,
    message,
    `${message}
      ${error}.

    Body: ${JSON.stringify(requestBody)}`
  );
  nextFunction(finalError);
}
