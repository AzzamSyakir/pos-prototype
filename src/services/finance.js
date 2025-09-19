import * as capitalRepo from '#repository/capital'
import { normalizeModal } from "#utils/calculate_utils";
import * as calculateRepo from '#repository/finance'
/**
 * @param {import('#dto/finance').CalculateFinanceSummaryDto} dto
 */
export async function CalculateFinanceSummary(dto) {
  const omzet = await calculateRepo.FetchOmzet(dto.userId, dto.targetLevel);

  if (!omzet || omzet == 0) {
    return {
      status: false,
      data: null,
      code: 500,
      message: "Transaction not found"
    };
  }

  const capital = await capitalRepo.FetchCapital(dto.userId);

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
    code: 200,
    status: true,
    data: {
      omzet,
      capital: normalizedCapital,
      profit
    },
    message: "CalculateSummary Success"
  };
}

export async function AddCapital(dto) {
  try {
    const capital = await capitalRepo.AddCapital(dto);

    if (!capital) {
      return {
        status: false,
        code: 500,
        message: "Internal server error",
        data: null,
      };
    }

    return {
      status: true,
      code: 201,
      message: "Add Capital Success",
      data: capital,
    };
  } catch (err) {
    return {
      status: false,
      code: 500,
      message: err.message || "Internal server error",
      data: null,
    };
  }
}