import express from 'express';
import { getOrdersChecksForShipment } from '../controllers/checksController';

const totalumRouter = express.Router();

totalumRouter.post('/check-orders-for-shipment', getOrdersChecksForShipment);

export default totalumRouter;
