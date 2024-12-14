import { NextFunction, Request, Response } from 'express';
import { TotalumApiSdk } from 'totalum-api-sdk';
import { totalumOptions } from '../../utils/constants';
import CustomError from '../../errors/CustomError';
import sseClientManager from '../../sse/sseClientManager';
import { getAllProfessionalParteners, getClientByNif } from '../services/totalum';

const totalumSdk = new TotalumApiSdk(totalumOptions);

export async function runScript(req: Request, res: Response, next: NextFunction) {

  try {
    const client = await getClientByNif('X5738759Yasdf');

    if (client) console.log('hello');

    res.status(200).json({client});
  } catch (error) {
    console.error('Error processing the file:', error.message);
    res.status(500).send('Error processing the file');
  }
}

export async function runSecondScript(req: Request, res: Response, next: NextFunction) {
  try {
    await totalumSdk.crud.createItem('pedido', {
      matricula: '9999999',
      socio_profesional: '669cca57ab9b3aabb59ace26',
    });

    res.status(200).json({client: true});
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
