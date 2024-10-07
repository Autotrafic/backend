import express from 'express';
import { toggleTotalumActiveHeader } from '../controllers/totalumController';

const totalumRouter = express.Router();

totalumRouter.post('/active-header', toggleTotalumActiveHeader);

export default totalumRouter;
