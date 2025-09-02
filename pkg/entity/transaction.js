export class TransactionEntity {
  constructor(id, amount, paymentMethod, accountholderName, email, accountNumber, routingNumber, userId, stripeCustomerId) {
    this.id = id
    this.amount = amount;
    this.status = "pending";
    this.paymentMethod = paymentMethod;
    this.userId = userId;
    this.stripeCustomerId = stripeCustomerId;

    if (paymentMethod === 'ach_direct_debit' && [accountholderName, accountNumber, routingNumber]) {
      this.accountholderName = accountholderName;
      this.accountNumber = accountNumber;
      this.routingNumber = routingNumber;
    }
    if (paymentMethod === 'sepa_debit' && email) {
      this.email = email;
    }
  }


  cancel() {
    this.status = "canceled";
  }

  isValidAmount() {
    return this.amount > 0;
  }
}