import express from 'express';
import {
  getAllUserLogs,
  getSessionLogsFromUserId,
  getActivityLogsFromSessionId,
  logActivity,
  logWhatsappClick,
  getWhatsappLogs,
} from '../controllers/loggerController';
import { checkIPWhitelist } from '../middleweares/checkIPWhitelist';

const logRouter = express.Router();

logRouter.get('/', getAllUserLogs);

logRouter.post('/whatsapp-click', logWhatsappClick);
logRouter.get('/whatsapp-click', getWhatsappLogs);

logRouter.get('/user/:userId', getSessionLogsFromUserId);
logRouter.get('/session/:sessionId', getActivityLogsFromSessionId);
logRouter.post('/register', checkIPWhitelist, logActivity);

export default logRouter;
