import express from 'express';
import { checkShipmentsAvailability, createLabel, getPdfLabel, makeMultipleShipments } from '../controllers/shipmentController';

const shipmentRouter = express.Router();

shipmentRouter.post('/', makeMultipleShipments);
shipmentRouter.get('/availability', checkShipmentsAvailability);

shipmentRouter.post('/create-label', createLabel);
shipmentRouter.post('/get-pdf-label', getPdfLabel);

export default shipmentRouter;
