import { NextFunction, Request, Response } from 'express';
import CustomError from '../../errors/CustomError';
import notifySlack, { sendWhatsappMessage } from '../services/notifier';

interface SendWhatsappBody extends Request {
  phoneNumber: string;
  message: string;
}

export async function sendWhatsapp(req: SendWhatsappBody, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await sendWhatsappMessage(req.body);

    res.send(response);
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

interface SendSlackBody extends Request {
  body: { message: string; channel?: 'whatsapp_messages' | 'orders' };
}

export async function sendSlackMessage(req: SendSlackBody, res: Response, next: NextFunction) {
  try {
    const { message, channel } = req.body;

    notifySlack(message, channel);

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
