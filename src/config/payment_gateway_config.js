import stripe from "stripe";
import env from "#config/env_config";


function CreateNewStripeObject() {
  const stripeObject = new stripe(env.PaymentGateway.secretKey);
  return stripeObject
}


const stripeObject = CreateNewStripeObject();
export default stripeObject;