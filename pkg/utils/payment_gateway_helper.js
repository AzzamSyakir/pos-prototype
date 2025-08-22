import stripe from "#config/payment_gateway_config";
async function CreatePaymentIntent(stripe) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 100000,
    currency: 'usd',
    payment_method: 'pm_card_visa',
    payment_method_types: ['card'],
    confirm: true,
  });
  return paymentIntent;
}
async function CreatePaymentMethod(stripe) {
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: '44242424242424242',
      exp_month: 12,
      exp_year: 34,
      cvc: '123',
    },
    billing_details: {
      name: 'John Doe',
    },
  });
  return paymentMethod;
}

async function ConfirmPayment(stripe, paymentIntentId) {

  const paymentIntent = await stripe.paymentIntents.confirm(
    paymentIntentId,
  );
  return paymentIntent
}

(async () => {
  const paymentIntent = await CreatePaymentIntent(stripe);
  const confirmPayment = await ConfirmPayment(stripe, paymentIntent.id)
  console.log(confirmPayment);
})();
