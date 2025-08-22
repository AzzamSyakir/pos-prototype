import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function createAndConfirmPayment() {
  try {
    // Step 1: Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,  // $10.99
      currency: 'usd',
      payment_method_types: ['card'],
      description: 'Test payment'
    });

    console.log('PaymentIntent created:', paymentIntent.id);
    console.log('Client Secret:', paymentIntent.client_secret);

    // Step 2: Attach a test payment method
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242', // Test card
        exp_month: 12,
        exp_year: 2030,
        cvc: '123',
      },
    });

    console.log('Test PaymentMethod created:', paymentMethod.id);

    // Step 3: Confirm the PaymentIntent with the test payment method
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      {
        payment_method: paymentMethod.id,
      }
    );

    console.log('PaymentIntent confirmed:', confirmedPaymentIntent.status);
    return confirmedPaymentIntent;

  } catch (error) {
    console.error('Error:', error);
  }
}

createAndConfirmPayment();