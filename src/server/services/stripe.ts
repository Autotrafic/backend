import Stripe from 'stripe';
import '../../loadEnvironment';

const isProduction = process.env.NODE_ENV === 'production';

const stripeKey = isProduction ? process.env.STRIPE_SECRET_KEY : process.env.STRIPE_TEST_SECRET_KEY;

const stripe = new Stripe(stripeKey, {});

interface StripeUser {
  name: string;
  email: string;
  phone: string;
  preferred_locales?: string[];
}

interface StripeCustomer {
  fullName: string;
  phoneNumber: string;
  email: string;
  stripeId: string;
}

interface PaymentIntent {
  paymentMethods: string[];
  automaticPaymentMethods: { enabled: boolean };
  amount: number;
  currency: string;
  customer: string;
}

export async function createStripePaymentIntent({
  automaticPaymentMethods,
  amount,
  currency = 'eur',
  customer,
}: PaymentIntent) {
  return stripe.paymentIntents.create({
    // payment_method_types: paymentMethods,
    automatic_payment_methods: automaticPaymentMethods,
    amount,
    currency,
    customer,
  });
}

export async function createStripeCustomer(user: StripeUser) {
  return stripe.customers.create({
    name: user.name,
    email: user.email,
    phone: user.phone,
    preferred_locales: ['es'],
  });
}

export async function updateStripeCustomer({ fullName, phoneNumber, email, stripeId }: StripeCustomer) {
  return stripe.customers.update(stripeId, {
    name: fullName,
    email,
    phone: phoneNumber,
    preferred_locales: ['es'],
  });
}

export async function createStripePrice(productId: string, amount: number) {
  return stripe.prices.create({
    unit_amount: amount,
    currency: 'eur',
    product: productId,
    tax_behavior: 'inclusive',
  });
}

export async function createStripePaymentLink(priceId: string) {
  return stripe.paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
  });
}
