import express from "express";
import { createPaymentIntent } from "../controllers/stripeController";
import csurf from "csurf";

const paymentRouter = express.Router();

const csrfProtection = csurf({ cookie: true });

paymentRouter.post("/create-intent", csrfProtection, createPaymentIntent);

export default paymentRouter;
