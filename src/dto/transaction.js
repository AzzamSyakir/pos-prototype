export class TransactionDto {
  constructor(amount, paymentMethod) {
    this.amount = amount;
    this.paymentMethod = paymentMethod;
  }

  static fromRequest(body) {
    return new TransactionDto(body.amount, body.payment_method);
  }

  hasAllRequiredFields() {
    return this.amount !== undefined && this.paymentMethod !== undefined;
  }

  isValidAmount() {
    return Number.isInteger(this.amount) && this.amount > 0;
  }

  isValidPaymentMethod() {
    const allowed = ['card', 'bank_direct', 'alipay'];
    return allowed.includes(this.paymentMethod);
  }
  validate() {
    const errors = [];

    if (this.amount === undefined) {
      errors.push("amount is required");
    } else if (!this.isValidAmount()) {
      errors.push("amount must be an integer greater than 0");
    }

    if (this.paymentMethod === undefined) {
      errors.push("payment_method is required");
    } else if (!this.isValidPaymentMethod()) {
      errors.push("payment_method must be one of: card, direct_debit, alipay");
    }

    const valid = errors.length === 0;

    return {
      valid,
      message: valid ? null : errors.join(", ")
    };
  }


}
