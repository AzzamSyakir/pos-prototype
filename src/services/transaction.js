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
    dto.routingNumber,
    dto.userId,
    dto.stripeCustomerId,
  );

  const currentTime = new Date();

  const result = await transactionRepo.CreateTransaction(trx, currentTime);

  const payment = await stripeUtils.CreatePayment(trx);

  const response = {
    status: 'success',
    transaction: result,
    payment: payment.payment ?? payment,
  };

  if (payment.verify_with_microdeposits) {
    response.verify_with_microdeposits = payment.verify_with_microdeposits;
  }
  return response;
}
export async function FetchTransaction(userId) {
  const result = await transactionRepo.FetchTransaction(userId);

  if (!result || result.length === 0) {
    return {
      success: false,
      message: "Transaction not found",
      data: null
    };
  }

  return {
    success: true,
    message: "Transaction fetched successfully",
    data: result
  };
}

