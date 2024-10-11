import express from 'express';
import { logAccounting } from '../controllers/loggerController';

const logRouter = express.Router();

logRouter.post('/accounting', logAccounting);

export default logRouter;
