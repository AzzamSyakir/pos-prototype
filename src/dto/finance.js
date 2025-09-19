export class CalculateFinanceSummaryDto {
  static allowedTargetLevels = ["day", "week", "month", "year"];
  static validFields = ["targetLevel", "userId"];

  constructor({ targetLevel, userId }) {
    this.targetLevel = targetLevel;
    this.userId = userId;
  }

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static validate(req) {
    const decoded = req?.decoded ?? {};
    const params = req?.params ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId,
      targetLevel: params.targetLevel,
    };

    const errors = [];

    const illegalFields = Object.keys(req.body ?? {}).filter(
      (k) => !this.validFields.includes(this.snakeToCamel(k))
    );
    if (illegalFields.length > 0) {
      errors.push(`Invalid fields: ${illegalFields.join(", ")}`);
    }

    const mapped = {};
    Object.keys(raw).forEach((k) => {
      const camelKey = this.snakeToCamel(k);
      mapped[camelKey] = raw[k];
    });

    if (!mapped.targetLevel) {
      errors.push("targetLevel is required");
    } else if (!this.allowedTargetLevels.includes(mapped.targetLevel)) {
      errors.push(
        `targetLevel must be one of: ${this.allowedTargetLevels.join(", ")}`
      );
    }

    if (!mapped.userId) {
      errors.push("userId is required");
    }

    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : null,
    };
  }

  static fromRequest(req) {
    const decoded = req?.decoded ?? {};
    const params = req?.params ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId,
      targetLevel: params.targetLevel,
    };

    const mapped = {};
    Object.keys(raw).forEach((key) => {
      const camelKey = this.snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = raw[key];
      }
    });

    return new CalculateFinanceSummaryDto(mapped);
  }
}
export class AddCapitalDto {
  static allowedTargetLevels = ["day", "week", "month", "year"];
  static validFields = ["amount", "targetLevel", "userId"];

  constructor({ amount, targetLevel, userId }) {
    this.amount = amount;
    this.targetLevel = targetLevel;
    this.userId = userId;
  }

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static validate(req) {
    const decoded = req?.decoded ?? {};
    const params = req?.params ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId,
      targetLevel: params.targetLevel,
    };

    const errors = [];

    const illegalFields = Object.keys(req.body ?? {}).filter(
      (k) => !this.validFields.includes(this.snakeToCamel(k))
    );
    if (illegalFields.length > 0) {
      errors.push(`Invalid fields: ${illegalFields.join(", ")}`);
    }

    const mapped = {};
    Object.keys(raw).forEach((k) => {
      const camelKey = this.snakeToCamel(k);
      mapped[camelKey] = raw[k];
    });

    if (mapped.amount === undefined || mapped.amount === null) {
      errors.push("amount is required");
    } else if (typeof mapped.amount !== "number" || isNaN(mapped.amount)) {
      errors.push("amount must be a valid number");
    } else if (mapped.amount <= 0) {
      errors.push("amount must be greater than 0");
    }

    if (!mapped.targetLevel) {
      errors.push("targetLevel is required");
    } else if (!this.allowedTargetLevels.includes(mapped.targetLevel)) {
      errors.push(
        `targetLevel must be one of: ${this.allowedTargetLevels.join(", ")}`
      );
    }

    if (!mapped.userId) {
      errors.push("userId is required");
    }

    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : null,
    };
  }

  static fromRequest(req) {
    const decoded = req?.decoded ?? {};
    const params = req?.params ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId,
      targetLevel: params.targetLevel,
    };

    const mapped = {};
    Object.keys(raw).forEach((key) => {
      const camelKey = this.snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = raw[key];
      }
    });

    return new AddCapitalDto(mapped);
  }
}
