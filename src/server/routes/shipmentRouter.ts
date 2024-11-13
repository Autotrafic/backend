import express from 'express';
import {
  checkShipmentsAvailability,
  createLabel,
  getPdfLabel,
  handleSendcloudWebhook,
  makeMultipleShipments,
} from '../controllers/shipmentController';

const shipmentRouter = express.Router();

shipmentRouter.post('/', makeMultipleShipments);
shipmentRouter.get('/availability', checkShipmentsAvailability);

shipmentRouter.post('/create-label', createLabel);
shipmentRouter.post('/get-pdf-label', getPdfLabel);
shipmentRouter.post('/sendcloud/webhook', handleSendcloudWebhook);

export default shipmentRouter;
