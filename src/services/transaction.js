import { TransactionEntity } from '#entity/transaction'
import * as stripeUtils from '#utils/stripe_utils'
import * as transactionRepo from '#repository/transaction'
/**
 * @param {import('#dto/transaction').TransactionDto} dto
 */
export async function CreateTransaction(dto) {
  const userEmail = await transactionRepo.GetUserEmailByUserId(dto.userId)
  const trx = new TransactionEntity(
    crypto.randomUUID(),
    dto.amount,
    dto.paymentMethod,
    dto.accountholderName,
    userEmail,
    dto.accountNumber,
    dto.routingNumber,
    dto.userId,
  );
  const currentTime = new Date();

  const payment = await stripeUtils.CreatePayment(trx);
  trx.StripePaymentId = payment.id
  const result = await transactionRepo.CreateTransaction(trx, currentTime);
  const response = {
    status: 'success',
    transaction: result,
    payment: payment,
  };
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

