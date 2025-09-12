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
    stripePaymentId
  ) {
    this.id = id;
    this.amount = amount;
    this.status = null;
    this.paymentMethod = paymentMethod;
    this.userId = userId;
    this.accountholderName = accountholderName;
    this.email = email;
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
    this.stripePaymentId = stripePaymentId
  }



  cancel() {
    this.status = "canceled";
  }

  isValidAmount() {
    return this.amount > 0;
  }
}