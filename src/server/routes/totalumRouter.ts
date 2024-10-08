import express from 'express';
import { getPendingTotalumTasks, toggleTotalumActiveHeader, updateTotalumTask } from '../controllers/totalumController';

const totalumRouter = express.Router();

totalumRouter.post('/active-header', toggleTotalumActiveHeader);

totalumRouter.get('/pending-tasks', getPendingTotalumTasks);
totalumRouter.post('/update-task', updateTotalumTask);

export default totalumRouter;
