import { TransactionEntity } from '#entity/transaction'
import * as stripeUtils from '#utils/stripe_utils'
import * as transactionRepo from '#repository/transaction'
/**
 * @param {import('#dto/transaction').TransactionDto} dto
 */
export async function CreateTransaction(dto) {
  const trx = new TransactionEntity(
    crypto.randomUUID(),
    dto.amount,
    dto.paymentMethod,
    dto.accountholderName,
    dto.email,
    dto.accountNumber,
    dto.routingNumber
  );
  const currentTime = new Date();
  const result = transactionRepo.CreateTransaction(trx, currentTime);
  stripeUtils.CreatePayment(trx)
  return result
}