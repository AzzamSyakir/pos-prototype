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
    status: true,
    data: {
      omzet,
      capital: normalizedCapital,
      profit
    },
    message: "Summary calculated successfully"
  };
}

export async function AddCapital(dto) {
  try {
    const capital = await capitalRepo.AddCapital(dto);

    if (!capital) {
      throw new Error("Failed to add capital");
    }

    return {
      status: true,
      message: "Capital added successfully",
      data: capital,
    };
  } catch (err) {
    return {
      status: false,
      message: err.message || "Internal server error",
      data: null,
    };
  }
}
