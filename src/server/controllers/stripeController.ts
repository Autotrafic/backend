import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { createStripePaymentIntent } from "../services/stripe";

const CURRENCY = "eur";
const AMOUNT = 11900;

export const createPaymentIntent = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { amount = AMOUNT } = req.body;

    try {
        const paymentIntent = await createStripePaymentIntent({
            paymentMethods: ["card"],
            amount,
            currency: CURRENCY,
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error making payment.",
            `Error making stripe payment. \n ${error}`
        );
        next(finalError);
    }
};
