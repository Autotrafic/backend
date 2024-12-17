import express from 'express';
import {
  getAllTotalumCollaborators,
  getAllTotalumProfessionalParteners,
  getPendingTotalumTasks,
  handleDocusealWebhook,
  sendOrderMandates,
  toggleTotalumActiveHeader,
  updateTotalumTask,
} from '../controllers/totalumController';

const totalumRouter = express.Router();

totalumRouter.post('/active-header', toggleTotalumActiveHeader);

totalumRouter.get('/pending-tasks', getPendingTotalumTasks);
totalumRouter.post('/update-task', updateTotalumTask);

totalumRouter.get('/professional-partners', getAllTotalumProfessionalParteners);
totalumRouter.get('/collaborators', getAllTotalumCollaborators);

totalumRouter.post('/mandates', sendOrderMandates);
totalumRouter.post('/docuseal/hook', handleDocusealWebhook);

export default totalumRouter;
