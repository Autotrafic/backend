import express from 'express';
import { sendSlackMessage, sendWhatsapp } from '../controllers/notifierController';

const messagesRouter = express.Router();

messagesRouter.post('/whatsapp', sendWhatsapp);

messagesRouter.post('/slack', sendSlackMessage);

export default messagesRouter;
