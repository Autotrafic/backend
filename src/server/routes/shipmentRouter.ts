import express from 'express';
import {
  checkShipmentsAvailability,
  createLabel,
  getPdfLabel,
  getProgress,
  handleSendcloudWebhook,
  makeMultipleShipments,
} from '../controllers/shipmentController';

const shipmentRouter = express.Router();

shipmentRouter.post('/', makeMultipleShipments);
shipmentRouter.get('/availability', checkShipmentsAvailability);

shipmentRouter.post('/create-label', createLabel);
shipmentRouter.post('/get-pdf-label', getPdfLabel);
shipmentRouter.post('/sendcloud/webhook', handleSendcloudWebhook);

shipmentRouter.get('/get-progress', getProgress);

export default shipmentRouter;
