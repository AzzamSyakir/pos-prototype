export class StripePaymentEventDto {
  constructor({ id, type, created, livemode, paymentId, customer, status }) {
    this.id = id;
    this.type = type;
    this.created = created;
    this.livemode = livemode;
    this.paymentId = paymentId;
    this.customer = customer;
    this.status = status;
  }

  static fromRequest(body) {
    const rawType = body.type ?? "";
    const obj = body.data?.object ?? {};

    let paymentId = null;

    if (rawType.startsWith("checkout.session")) {
      paymentId = obj.payment_link ?? null;
    } else {
      paymentId = obj.payment_intent ?? obj.id ?? null;
    }

    const customer = obj.customer ?? null;

    let status = null;

    if (rawType.startsWith("checkout.session")) {
      status = obj.payment_status ?? obj.status ?? null;
    } else if (rawType.startsWith("payment_intent.")) {
      const parts = rawType.split(".");
      status = parts[parts.length - 1];
    } else if (rawType.startsWith("payment_link.")) {
      const parts = rawType.split(".");
      status = parts[parts.length - 1];
    }

    return new StripePaymentEventDto({
      id: body.id,
      type: rawType,
      created: body.created,
      livemode: body.livemode,
      paymentId,
      customer,
      status,
    });
  }

  static validateFormRequest(body) {
    const errors = [];
    const safeBody = body ?? {};

    ["id", "type", "created", "data"].forEach((f) => {
      if (safeBody[f] === undefined || safeBody[f] === null) {
        errors.push(`${f} is required`);
      }
    });

    if (safeBody.id && typeof safeBody.id !== "string") {
      errors.push("id must be a string");
    }

    if (
      safeBody.type &&
      !(
        safeBody.type.startsWith("payment_intent.") ||
        safeBody.type.startsWith("checkout.session.") ||
        safeBody.type.startsWith("payment_link.")
      )
    ) {
      errors.push(
        "type must be payment_intent.*, checkout.session.*, or payment_link.*"
      );
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
