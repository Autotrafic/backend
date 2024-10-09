import express from 'express';
import { createPaymentIntent, createPaymentLink } from '../controllers/stripeController';

const paymentRouter = express.Router();

paymentRouter.post('/create-intent', createPaymentIntent);

paymentRouter.post('/create-payment-link', createPaymentLink);

export default paymentRouter;
