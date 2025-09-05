import stripe from "#config/payment_gateway_config";
/**
 * @param {import('#entity/transaction').TransactionEntity} trx
 */

export async function CreatePayment(trx) {
  const methodMap = {
    card: ['card'],
    ach_direct_debit: ['us_bank_account'],
    sepa_debit: ['sepa_debit'],
  };

  if (trx.paymentMethod === 'payment_link') {
    const price = await stripe.prices.create({
      currency: 'usd',
      unit_amount: trx.amount,
      product_data: { name: 'New Payment' },
    });

    return await stripe.paymentLinks.create({
      line_items: [{ price: price.id, quantity: 1 }],
    });
  }

  const paymentTypes = methodMap[trx.paymentMethod];
  if (!paymentTypes) throw new Error(`Unsupported payment method: ${trx.paymentMethod}`);
  const currency = trx.paymentMethod === 'sepa_debit' ? 'eur' : 'usd';

  const paymentIntentParams = {
    amount: trx.amount,
    currency,
    payment_method_types: paymentTypes,
    customer: trx.stripeCustomerId,
    confirm: true,
  };

  if (trx.paymentMethod === 'card') {
    paymentIntentParams.payment_method = 'pm_card_visa';
  } else if (trx.paymentMethod === 'ach_direct_debit') {
    paymentIntentParams.payment_method_data = {
      type: 'us_bank_account',
      billing_details: {
        name: trx.accountholderName || 'Unknown',
        email: trx.email || 'unknown@mail.com',
      },
      us_bank_account: {
        account_holder_type: 'individual',
        account_number: trx.accountNumber || '000123456789',
        routing_number: trx.routingNumber || '110000000',
      },
    };
    paymentIntentParams.mandate_data = {
      customer_acceptance: {
        type: 'online',
        online: {
          ip_address: trx.ip || '127.0.0.1',
          user_agent: trx.userAgent || 'Mozilla/5.0',
        },
      },
    };
  } else if (trx.paymentMethod === 'sepa_debit') {
    paymentIntentParams.payment_method_data = {
      type: 'sepa_debit',
      billing_details: {
        name: trx.accountholderName || 'Unknown',
        email: trx.email || 'unknown@mail.com',
      },

      sepa_debit: {
        iban: trx.iban || 'DE89370400440532013000',
      },
    };
    paymentIntentParams.mandate_data = {
      customer_acceptance: {
        type: 'online',
        online: {
          ip_address: trx.ip || '127.0.0.1',
          user_agent: trx.userAgent || 'Mozilla/5.0',
        },
      },
    };
  }

  const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams, {
    idempotencyKey: crypto.randomUUID(),
  });

  if (trx.paymentMethod === 'ach_direct_debit') {
    if (paymentIntent.next_action?.verify_with_microdeposits) {
      return paymentIntent.next_action.verify_with_microdeposits;
    }
  }

  return paymentIntent;
}

/**
 * @param { import('#entity/auth').UserEntity } auth
  */
export async function CreateCustomer(auth) {
  const customer = await stripe.customers.create({
    name: auth.name,
    email: auth.email,
  });
  return customer
}

