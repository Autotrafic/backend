import '../../loadEnvironment';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../errors/CustomError';
import { WebConsultCount, WhatsappCount } from '../../database/models/ActivityLog';

export const getWhatsappLogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logs = await WhatsappCount.find();
        res.status(200).json(logs);
    } catch (error) {
        console.error(error);
        const finalError = new CustomError(
            500,
            "Error retrieving whatsapp click logs.",
            `Error retrieving whatsapp click logs. ${error}.`
        );
        next(finalError);
    }
};

export const logWhatsappClick = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const dateString = today.getDate().toString();
    const monthString = today.toLocaleString('default', { month: 'long' });

    const monthLog = await WhatsappCount.findOne({ month: monthString });

    if (monthLog) {
      const dayLog = monthLog.days.find((day) => day.day === dateString);

      if (dayLog) {
        dayLog.count += 1;
      } else {
        monthLog.days.push({ day: dateString, timestamp: today, count: 1 });
      }
      await monthLog.save();
    } else {
      const newLog = new WhatsappCount({
        month: monthString,
        days: [{ day: dateString, timestamp: today, count: 1 }],
      });
      await newLog.save();
    }

    res.status(200).json({ message: 'Whatsapp click logged successfully.' });
  } catch (error) {
    console.error(error);
    const finalError = new CustomError(500, 'Error logging whatsapp Click.', `Error logging whatsapp Click. ${error}.`);
    next(finalError);
  }
};

export const logWebConsult = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const today = new Date();
    const dateString = today.getDate().toString();
    const monthString = today.toLocaleString('default', { month: 'long' });

    const monthLog = await WebConsultCount.findOne({ month: monthString });

    if (monthLog) {
      const dayLog = monthLog.days.find((day) => day.day === dateString);

      if (dayLog) {
        dayLog.count += 1;
      } else {
        monthLog.days.push({ day: dateString, timestamp: today, count: 1 });
      }
      await monthLog.save();
    } else {
      const newLog = new WebConsultCount({
        month: monthString,
        days: [{ day: dateString, timestamp: today, count: 1 }],
      });
      await newLog.save();
    }

    res.status(200).json({ message: 'Web consult logged successfully.' });
  } catch (error) {
    console.error(error);
    const finalError = new CustomError(500, 'Error logging web consult.', `Error logging web consult. ${error}.`);
    next(finalError);
  }
};