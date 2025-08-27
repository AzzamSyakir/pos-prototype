import stripe from "#config/payment_gateway_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */
export async function CreatePaymentIntent(trx) {
  const methodMap = {
    card: {
      payment_method_types: ['card'],
      payment_method: 'pm_card_visa'
    },
    direct_debit: {
      payment_method_types: ['direct_debit'],
      payment_method: 'pm_usBankAccount'
    },
    alipay: {
      payment_method_types: ['alipay']
    }
  };

  const config = methodMap[trx.paymentMethod];
  if (!config) {
    throw new Error(`Unsupported payment method: ${trx.paymentMethod}`);
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: trx.amount,
    currency: 'usd',
    ...config,
    confirm: true
  }, {
    idempotencyKey: crypto.randomUUID()
  });
  return paymentIntent;
}