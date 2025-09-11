import { TransactionEntity } from '#entity/transaction'
import * as stripeUtils from '#utils/stripe_utils'
import * as transactionRepo from '#repository/transaction'
import * as capitalRepo from '#repository/capitals'
import { normalizeModal } from "#utils/calculate_utils";
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

  const payment = await stripeUtils.CreatePayment(trx);
  trx.stripePaymentId = payment.id
  const result = await transactionRepo.CreateTransaction(trx);
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
/**
 * @param {import('#dto/transaction').TransactionSummary} dto
 */
export async function CalculateSummary(userId, dto) {
  const omzet = await transactionRepo.FetchTransactionOmzet(userId, dto.targetLevel);

  if (!omzet || omzet == 0) {
    return {
      status: false,
      data: null,
      message: "Transaction not found"
    };
  }

  const capital = await capitalRepo.FetchUserCapital(userId);

  let normalizedCapital = 0;
  if (capital) {
    normalizedCapital = normalizeModal(
      capital.amount,
      capital.type,
      dto.targetLevel
    );
  }

  const profit = omzet - normalizedCapital;

  return {
    status: true,
    data: {
      omzet,
      capital: normalizedCapital,
      profit
    },
    message: "Summary calculated successfully"
  };
}
