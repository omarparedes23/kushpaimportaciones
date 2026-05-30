import Stripe from 'stripe';
import { PaymentGateway, PaymentIntent } from './types';

// Initialize Stripe with a placeholder key if environment variable is missing during build
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2026-05-27.dahlia',
});

export class StripeProvider implements PaymentGateway {
  async createPaymentIntent(amount: number, currency: string = 'PEN', metadata?: Record<string, string>): Promise<PaymentIntent> {
    try {
      const intent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Stripe expects amounts in cents
        currency: currency.toLowerCase(),
        metadata: metadata,
      });

      return {
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        clientSecret: intent.client_secret,
        status: intent.status as any,
      };
    } catch (error) {
      console.error('Stripe createPaymentIntent error:', error);
      throw error;
    }
  }

  async confirmPayment(intentId: string): Promise<boolean> {
    // Usually handled on the client side via Stripe.js (confirmCardPayment)
    // Server-side confirmation is rare unless capturing manual payments
    return true; 
  }

  async cancelPayment(intentId: string): Promise<boolean> {
    try {
      const intent = await stripe.paymentIntents.cancel(intentId);
      return intent.status === 'canceled';
    } catch (error) {
      console.error('Stripe cancelPayment error:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const stripeGateway = new StripeProvider();
