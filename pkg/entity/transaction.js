export class TransactionEntity {
  constructor(amount, paymentMethod) {
    this.amount = amount;
    this.status = "pending";
    this.paymentMethod = paymentMethod;
  }

  cancel() {
    this.status = "canceled";
  }

  isValidAmount() {
    return this.amount > 0;
  }
}