import { TransactionEntity } from '#entity/transaction'
import * as paymentGatewayUtils from '#utils/payment_gateway_utils'
/**
 * @param {import('#dto/transaction').TransactionDto} dto
 */
export async function CreateTransaction(dto) {
  const trx = new TransactionEntity(
    dto.amount,
    dto.paymentMethod
  );
  const paymentIntent = await paymentGatewayUtils.CreatePaymentIntent(trx)
  return paymentIntent
}