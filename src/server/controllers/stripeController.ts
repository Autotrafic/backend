import { NextFunction, Request, Response } from "express";
import CustomError from "../../errors/CustomError";
import { createStripePaymentIntent } from "../services/stripe";
import {
    createUser,
    getUserByPhoneNumber,
    updateUserByPhoneNumber,
} from "../../database/repository/user";
import { CreateIntentRequestBody } from "../../interfaces/stripe";

const CURRENCY = "eur";
const AMOUNT = 12995;

interface RequestWithBody extends Request {
    body: CreateIntentRequestBody;
}

export default async function createPaymentIntent(
    req: RequestWithBody,
    res: Response,
    next: NextFunction
) {
    const { amount = AMOUNT, userData } = req.body;
    const { fullName, phoneNumber, email } = userData;

    try {
        let user = await getUserByPhoneNumber(phoneNumber);

        if (!user) {
            user = await createUser(fullName, phoneNumber, email);
        } else {
            const updatedUser = {
                fullName,
                phoneNumber,
                email: user.email,
                stripeId: user.stripeId,
            };
            await updateUserByPhoneNumber(updatedUser);
        }

        const paymentIntent = await createStripePaymentIntent({
            paymentMethods: ["card", "link"],
            automaticPaymentMethods: { enabled: true },
            amount,
            currency: CURRENCY,
            customer: user.stripeId,
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        console.log(error);
        const finalError = new CustomError(
            400,
            "Error making payment.",
            `Error making stripe payment.
            ${error}.
            
      Body: ${JSON.stringify(req.body)}`
        );
        next(finalError);
    }
}
