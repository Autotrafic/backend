import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import sseClientManager from '../../sse/sseClientManager';
import { createClientAndRelatedItem, getAllProfessionalParteners, getClientByNif } from '../services/totalum';
import { parsePdfUrlToBase64 } from '../parsers/file';
import { createTemplateFromPdf } from '../services/docuseal';
import { sendMandate } from '../handlers/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {
  try {
    const submission = await sendMandate('66794a7e948441f51c00c501');

    res.status(200).json({ submission });
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      `Error running script. ${error.message}.`,
      `Error running script. ${error.message}.`
    );
    next(finalError);
  }
}

export async function runSecondScript(req: Request, res: Response, next: NextFunction) {
  try {
    await totalumSdk.crud.createItem('pedido', {
      matricula: '9999999',
      socio_profesional: '669cca57ab9b3aabb59ace26',
    });

    res.status(200).json({ client: true });
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
