export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  clientSecret: string | null;
  status: 'requires_payment_method' | 'requires_confirmation' | 'requires_action' | 'processing' | 'succeeded' | 'canceled';
}

export interface PaymentGateway {
  createPaymentIntent(amount: number, currency?: string, metadata?: Record<string, string>): Promise<PaymentIntent>;
  confirmPayment(intentId: string): Promise<boolean>;
  cancelPayment(intentId: string): Promise<boolean>;
}
