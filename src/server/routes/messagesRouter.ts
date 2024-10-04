import express from 'express';
import { sendSlackMessage, sendWhatsappMessage } from '../controllers/notifierController';

const messagesRouter = express.Router();

messagesRouter.post('/whatsapp', sendWhatsappMessage);

messagesRouter.post('/slack', sendSlackMessage);

export default messagesRouter;
