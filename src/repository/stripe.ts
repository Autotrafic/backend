import Stripe from "stripe";
import "../../src/loadEnvironment";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {});

interface PaymentIntentProps {
    paymentMethods: string[];
    amount: number;
    currency: string;
    description: string;
}

export const createStripePaymentIntent = async ({
    paymentMethods,
    amount,
    currency = "eur",
    description,
}: PaymentIntentProps) =>
    stripe.paymentIntents.create({
        payment_method_types: paymentMethods,
        amount,
        currency,
        description,
    });

