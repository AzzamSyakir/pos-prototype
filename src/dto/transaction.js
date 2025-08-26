export class CreateNewTransactionDto {
  constructor(amount, paymentMethod) {
    this.amount = amount
    this.paymentMethod = paymentMethod
  }
}