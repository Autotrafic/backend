import express from 'express';
import { sendSlackMessage, sendWhatsapp } from '../controllers/notifierController';
import { getAllChats, getChatMessages, sendMessage } from '../controllers/whatsappController';

const whatsappRouter = express.Router();

whatsappRouter.post('/message', sendMessage);

whatsappRouter.get('/chats', getAllChats);
whatsappRouter.get('/messages/:chatId', getChatMessages);

export default whatsappRouter;