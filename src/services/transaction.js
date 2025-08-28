import { TransactionEntity } from '#entity/transaction'
import * as paymentGatewayUtils from '#utils/payment_gateway_utils'
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
  paymentGatewayUtils.CreatePayment(trx)
  return result
}