import express from 'express';
import { createLabel, getPdfLabel, makeShipment } from '../controllers/shipmentController';

const shipmentRouter = express.Router();

shipmentRouter.post('/', makeShipment);

shipmentRouter.post('/create-label', createLabel);
shipmentRouter.post('/get-pdf-label', getPdfLabel);

export default shipmentRouter;
