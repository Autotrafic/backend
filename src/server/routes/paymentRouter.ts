import express from "express";
import { createPaymentIntent } from "../controllers/stripeController";

const paymentRouter = express.Router();

paymentRouter.post("/create-intent", createPaymentIntent);

export default paymentRouter;
