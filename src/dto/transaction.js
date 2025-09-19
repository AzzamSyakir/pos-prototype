export class TransactionDto {
  constructor({
    amount,
    paymentMethod,
    accountholderName,
    accountNumber,
    routingNumber,
    iban,
    email,
    stripeCustomerId,
    userId,
  }) {
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.accountholderName = accountholderName;
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
    this.iban = iban;
    this.email = email;
    this.stripeCustomerId = stripeCustomerId;
    this.userId = userId;
  }

  static validFields = [
    "amount",
    "paymentMethod",
    "accountholderName",
    "accountNumber",
    "routingNumber",
    "iban",
    "email",
  ];

  static paymentMethods = [
    "payment_link",
    "card",
    "ach_direct_debit",
    "sepa_debit",
  ];

  static optionalFieldsRules = [
    {
      fields: ["accountholderName"],
      allowed: ["ach_direct_debit", "sepa_debit"],
    },
    { fields: ["accountNumber", "routingNumber"], allowed: ["ach_direct_debit"] },
    { fields: ["iban", "email"], allowed: ["sepa_debit"] },
  ];

  static stringFields = [
    "accountholderName",
    "accountNumber",
    "routingNumber",
    "iban",
    "email",
  ];

  static requiredFields = ["amount", "paymentMethod"];

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static validate(req) {
    const body = req?.body ?? {};
    const decoded = req?.decoded ?? {};
    const raw = {
      ...body,
      userId: decoded.userId,
      stripeCustomerId: decoded.stripe_cus_id,
    };

    const errors = [];

    const illegalFields = Object.keys(body).filter(
      (k) => !this.validFields.includes(this.snakeToCamel(k))
    );
    if (illegalFields.length > 0) {
      errors.push(`Invalid fields: ${illegalFields.join(", ")}`);
    }

    const mapped = {};
    Object.keys(raw).forEach((k) => {
      const camelKey = this.snakeToCamel(k);
      mapped[camelKey] = raw[k];
    });

    this.requiredFields.forEach((f) => {
      if (
        mapped[f] === undefined ||
        mapped[f] === null ||
        mapped[f] === ""
      ) {
        errors.push(`${f} is required`);
      }
    });

    if (
      mapped.paymentMethod &&
      !this.paymentMethods.includes(mapped.paymentMethod)
    ) {
      errors.push(
        `paymentMethod must be one of: ${this.paymentMethods.join(", ")}`
      );
    }

    this.optionalFieldsRules.forEach((rule) => {
      const invalid = rule.fields.filter(
        (f) =>
          mapped[f] !== undefined &&
          !rule.allowed.includes(mapped.paymentMethod)
      );
      if (invalid.length > 0) {
        errors.push(
          `field ${invalid.join(" and ")} ${invalid.length > 1 ? "are" : "is"
          } only allowed for ${rule.allowed.join(" or ")}`
        );
      }
    });

    this.stringFields.forEach((f) => {
      if (mapped[f] !== undefined && typeof mapped[f] !== "string") {
        errors.push(`${f} must be a string`);
      }
    });

    if (mapped.amount !== undefined) {
      if (typeof mapped.amount !== "number" || isNaN(mapped.amount)) {
        errors.push("amount must be a valid number");
      } else if (mapped.amount <= 0) {
        errors.push("amount must be greater than 0");
      }
    }

    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : null,
    };
  }

  static fromRequest(req) {
    const body = req?.body ?? {};
    const decoded = req?.decoded ?? {};

    const mapped = {};
    Object.keys(body).forEach((key) => {
      const camelKey = this.snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = body[key];
      }
    });

    return new TransactionDto({
      ...mapped,
      userId: decoded.userId,
      stripeCustomerId: decoded.stripe_cus_id,
    });
  }
}
