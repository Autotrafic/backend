import express from 'express';
import {
  getAllTotalumProfessionalParteners,
  getPendingTotalumTasks,
  toggleTotalumActiveHeader,
  updateTotalumTask,
} from '../controllers/totalumController';

const totalumRouter = express.Router();

totalumRouter.post('/active-header', toggleTotalumActiveHeader);

totalumRouter.get('/pending-tasks', getPendingTotalumTasks);
totalumRouter.post('/update-task', updateTotalumTask);

totalumRouter.get('/professional-partners', getAllTotalumProfessionalParteners);

export default totalumRouter;
