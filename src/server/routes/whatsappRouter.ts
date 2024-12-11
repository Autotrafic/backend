import express from 'express';
import { getAllChats, getChatMessages, sendMessage } from '../controllers/whatsappController';

const whatsappRouter = express.Router();

whatsappRouter.post('/message', sendMessage);

whatsappRouter.get('/chats', getAllChats);
whatsappRouter.get('/messages/:phoneNumber', getChatMessages);

export default whatsappRouter;