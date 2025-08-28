export class TransactionEntity {
  constructor(amount, paymentMethod, accountholderName, email, accountNumber, routingNumber) {
    this.amount = amount;
    this.status = "pending";
    this.paymentMethod = paymentMethod;


    if (paymentMethod === 'ach_direct_debit' && accountholderName) {
      this.accountholderName = accountholderName;
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