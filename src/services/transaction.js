import { TransactionEntity } from '#entity/transaction'

export function CreateTransaction(amount) {
  const trx = new TransactionEntity(amount);
  console.log(trx);
}