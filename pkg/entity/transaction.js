export class TransactionEntity {
  constructor(amount) {
    this.amount = amount;
    this.status = "pending";
  }

  cancel() {
    this.status = "canceled";
  }

  isValidAmount() {
    return this.amount > 0;
  }
}