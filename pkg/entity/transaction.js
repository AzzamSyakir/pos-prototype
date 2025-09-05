export class TransactionEntity {
  constructor(
    id,
    amount,
    paymentMethod,
    accountholderName,
    email,
    accountNumber,
    routingNumber,
    userId,
    stripeCustomerId
  ) {
    this.id = id;
    this.amount = amount;
    this.status = "pending";
    this.paymentMethod = paymentMethod;
    this.userId = userId;
    this.stripeCustomerId = stripeCustomerId;
    this.accountholderName = accountholderName;
    this.email = email;
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
  }



  cancel() {
    this.status = "canceled";
  }

  isValidAmount() {
    return this.amount > 0;
  }
}