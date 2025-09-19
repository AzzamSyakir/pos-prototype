export class StripePaymentEventDto {
  constructor({ paymentId, status }) {
    this.paymentId = paymentId;
    this.status = status;
  }

  static validate(req) {
    const body = req?.body ?? {};
    const errors = [];
    if (
      body.type &&
      !(
        body.type.startsWith("payment_intent.") ||
        body.type.startsWith("checkout.session.") ||
        body.type.startsWith("payment_link.")
      )
    ) {
      errors.push(
        "type must be payment_intent.*, checkout.session.*, or payment_link.*"
      );
    }

    return {
      valid: errors.length === 0,
      message: errors.join(", "),
    };
  }

  static fromRequest(req) {
    const body = req?.body ?? {};
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
}