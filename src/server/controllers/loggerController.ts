import { NextFunction, Response } from 'express';
import CustomError from '../../errors/CustomError';
import { Accounting } from '../../interfaces/totalum/contabilidad';
import { createAccounting } from '../services/totalum';
import { LogAccountingBody } from '../../interfaces/import/totalum';

export const logAccounting = async (req: LogAccountingBody, res: Response, next: NextFunction) => {
  try {
    const { business, accountingType } = req.body;

    const date = new Date();
    const accounting: Accounting = { date, business, accountingType };

    await createAccounting(accounting);

    res.status(200).json({ message: 'Accounting logged successfully on Totalum.' });
  } catch (error) {
    console.error(error);
    const finalError = new CustomError(500, 'Error logging web consult.', `Error logging web consult. ${error}.`);
    next(finalError);
  }
};
