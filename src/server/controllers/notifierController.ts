import '../../loadEnvironment';
import { NextFunction, Request, Response } from 'express';
import CustomError from '../../errors/CustomError';
import notifySlack from '../services/notifier';
import axios from 'axios';

const whatsappApi = process.env.AUTOTRAFIC_WHATSAPP_API;

export async function sendWhatsappMessage(req: Request, res: Response, next: NextFunction): Promise<void> {
  const { phoneNumber, message } = req.body;

  const endpoint = `${whatsappApi}/messages/send`;
  const options = { phoneNumber, message };

  try {
    const response = await axios.post(endpoint, options);

    res.send(response.data);
  } catch (error) {
    const finalError = new CustomError(
      500,
      `Error sending WhatsApp message.`,
      `Error sending WhatsApp message.
            ${error}.
            
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function sendSlackMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const { message } = req.body;

    notifySlack(message);

    res.status(200).json('Message sent successfully.');
  } catch (error) {
    console.log(error);
    const finalError = new CustomError(
      400,
      'Error sending message to Slack.',
      `Error sending message to Slack.
            ${error}.
            
      Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
