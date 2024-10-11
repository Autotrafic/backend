import express from 'express';
import {
  logWhatsappClick,
  getWhatsappLogs,
  logWebConsult,
} from '../controllers/loggerController';

const logRouter = express.Router();

logRouter.post('/web-consult', logWebConsult);

logRouter.post('/whatsapp-click', logWhatsappClick);
logRouter.get('/whatsapp-click', getWhatsappLogs);

export default logRouter;
