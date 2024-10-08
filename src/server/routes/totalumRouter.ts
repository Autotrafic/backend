import express from 'express';
import { getPendingTotalumTasks, toggleTotalumActiveHeader } from '../controllers/totalumController';

const totalumRouter = express.Router();

totalumRouter.post('/active-header', toggleTotalumActiveHeader);

totalumRouter.get('/pending-tasks', getPendingTotalumTasks);

export default totalumRouter;
