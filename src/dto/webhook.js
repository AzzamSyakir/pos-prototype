export class StripePaymentIntentEventDto {
  constructor({ id, type, created, livemode, paymentIntent, customer }) {
    this.id = id;
    this.type = type;
    this.created = created;
    this.livemode = livemode;
    this.paymentIntent = paymentIntent;
    this.customer = customer;
  }

  static validFields = [
    "id",
    "object",
    "api_version",
    "created",
    "data",
    "livemode",
    "pending_webhooks",
    "request",
    "type",
    "customer",
  ];

  static fromRequest(body) {
    const rawType = body.type ?? "";
    const simpleType = rawType.startsWith("payment_intent.")
      ? rawType.replace("payment_intent.", "")
      : rawType;

    const paymentIntent = body.data?.object ?? {};

    return new StripePaymentIntentEventDto({
      id: body.id,
      type: simpleType,
      created: body.created,
      livemode: body.livemode,
      paymentIntent,
      customer: paymentIntent.customer ?? null,
    });
  }

  static validateFormRequest(body) {
    const errors = [];
    const safeBody = body ?? {};

    ["id", "type", "created", "data"].forEach((f) => {
      const value = safeBody[f];
      if (value === undefined || value === null) {
        errors.push(`${f} is required`);
      }
    });

    if (safeBody.id && typeof safeBody.id !== "string") {
      errors.push("id must be a string");
    }
    if (safeBody.type && !safeBody.type.startsWith("payment_intent.")) {
      errors.push("type must be a payment_intent event");
    }
    if (safeBody.created && typeof safeBody.created !== "number") {
      errors.push("created must be a number (timestamp)");
    }

    const customer = safeBody.data?.object?.customer;
    if (customer && typeof customer !== "string") {
      errors.push("customer must be a string if provided");
    }

    return {
      valid: errors.length === 0,
      message: errors.join(", "),
    };
  }
}
