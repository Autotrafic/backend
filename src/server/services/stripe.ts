import Stripe from "stripe";
import "../../loadEnvironment";

const isProduction = false;

const stripeKey = isProduction
    ? process.env.STRIPE_SECRET_KEY
    : process.env.STRIPE_TEST_SECRET_KEY;

const stripe = new Stripe(stripeKey, {});

interface PaymentIntentProps {
    paymentMethods: string[];
    amount: number;
    currency: string;
}

export const createStripePaymentIntent = async ({
    paymentMethods,
    amount,
    currency = "eur",
}: PaymentIntentProps) => {
    return stripe.paymentIntents.create({
        payment_method_types: paymentMethods,
        amount,
        currency,
    });
};
