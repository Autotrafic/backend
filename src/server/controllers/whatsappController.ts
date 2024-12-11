import { NextFunction, Request, Response } from 'express';
import { SendWhatsappBody } from '../../interfaces/import/whatsapp';
import { getAllWhatsappChats, getWhatsappChatMessages, sendWhatsappMessage } from '../services/notifier';
import CustomError from '../../errors/CustomError';
import { parseFullWhatsChat, parseFullWhatsMessage } from '../parsers/whatsapp';

export async function sendMessage(req: SendWhatsappBody, res: Response, next: NextFunction): Promise<void> {
  try {
    const response = await sendWhatsappMessage(req.body);

    res.send(response);
  } catch (error) {
    const finalError = new CustomError(
      500,
      `Error sending WhatsApp message. ${error.message}`,
      `Error sending WhatsApp message.
              ${error.message}.
              
        Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function getAllChats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const allChats = await getAllWhatsappChats();

    const formattedChats = allChats.map((chat) => parseFullWhatsChat(chat));

    res.status(200).json({ chats: formattedChats });
  } catch (error) {
    const finalError = new CustomError(
      500,
      `Error sending WhatsApp message. ${error}`,
      `Error sending WhatsApp message.
                ${error}.
                
          Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}

export async function getChatMessages(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { phoneNumber } = req.params;

    if (!phoneNumber) {
      res.status(404).send({ message: `No chat id provided.` });
      return;
    }

    const chatMessages = await getWhatsappChatMessages(phoneNumber);

    const formattedChatMessages = chatMessages.map((message) => parseFullWhatsMessage(message));

    res.status(200).json({ chatMessages: formattedChatMessages });
  } catch (error) {
    const finalError = new CustomError(
      500,
      `Error fetching chat messages. ${error}`,
      `Error fetching chat messages.
                  ${error}.
                  
            Body: ${JSON.stringify(req.body)}`
    );
    next(finalError);
  }
}
