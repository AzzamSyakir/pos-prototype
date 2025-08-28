export class TransactionModel {
  constructor(id, amount, status, paymentMethod, created_at, updated_at) {
    this.id = id;
    this.amount = amount;
    this.status = status;
    this.paymentMethod = paymentMethod;
    this.created_at = created_at;
    this.updated_at = updated_at
  }
}
