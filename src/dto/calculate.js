export class CalculateSummaryDto {
  static allowedTargetLevels = ["day", "week", "month", "year"];

  constructor({ targetLevel, userId }) {
    this.targetLevel = targetLevel;
    this.userId = userId;
    this.validate();
  }

  validate() {
    if (
      !CalculateSummaryDto.allowedTargetLevels.includes(this.targetLevel)
    ) {
      throw new Error(
        `targetLevel must be one of: ${CalculateSummaryDto.allowedTargetLevels.join(", ")}`
      );
    }
  }
}
export class AddCapitalDto {
  static allowedTargetLevels = ["day", "week", "month", "year"];

  constructor({ amount, targetLevel, userId }) {
    this.amount = amount;
    this.targetLevel = targetLevel;
    this.userId = userId;
    this.validate();
  }

  validate() {
    if (typeof this.amount !== "number" || isNaN(this.amount)) {
      throw new Error("amount must be a valid number");
    }
    if (this.amount <= 0) {
      throw new Error("amount must be greater than 0");
    }

    if (!AddCapitalDto.allowedTargetLevels.includes(this.targetLevel)) {
      throw new Error(
        `targetLevel must be one of: ${AddCapitalDto.allowedTargetLevels.join(", ")}`
      );
    }
  }
}
