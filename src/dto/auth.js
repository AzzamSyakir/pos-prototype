export class AuthRegisterDto {
  constructor({ name, email, password, phoneNumber }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }

  static validFields = ["name", "email", "password", "phoneNumber"];
  static requiredFields = ["name", "email", "password", "phoneNumber"];

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  static validate(req) {
    const raw = req?.body ?? {};
    const errors = [];

    // mapping snake_case -> camelCase, plus keep reference ke rawKey
    const mapped = {};
    const keyMap = {}; // camelKey -> rawKey
    Object.keys(raw).forEach((rawKey) => {
      const camelKey = this.snakeToCamel(rawKey);
      mapped[camelKey] = raw[rawKey];
      keyMap[camelKey] = rawKey;
    });

    // cek field ilegal (pakai rawKey biar konsisten dengan request)
    const illegalFields = Object.keys(raw).filter(
      (rawKey) => !this.validFields.includes(this.snakeToCamel(rawKey))
    );
    if (illegalFields.length > 0) {
      errors.push(`Invalid fields: ${illegalFields.join(", ")}`);
    }

    // cek required + type
    this.requiredFields.forEach((camelKey) => {
      const rawKey = keyMap[camelKey] || this.camelToSnake(camelKey);

      if (
        mapped[camelKey] === undefined ||
        mapped[camelKey] === null ||
        mapped[camelKey] === ""
      ) {
        errors.push(`${rawKey} is required`);
      } else if (typeof mapped[camelKey] !== "string") {
        errors.push(`${rawKey} must be a string`);
      }
    });

    // validasi khusus email
    if (mapped.email && typeof mapped.email === "string") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(mapped.email)) {
        errors.push("email must be a valid email address");
      }
    }

    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : null,
    };
  }

  static fromRequest(req) {
    const raw = { ...req.body };

    const snakeToCamel = (str) =>
      str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

    const mapped = {};
    Object.keys(raw).forEach((key) => {
      const camelKey = snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = raw[key];
      }
    });

    return new AuthRegisterDto(mapped);
  }
}
export class AuthLoginDto {
  constructor({ name, email, password }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static validFields = ["name", "email", "password"];
  static requiredFields = ["password"]; // password selalu wajib

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static camelToSnake(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  static validate(req) {
    const raw = req?.body ?? {};
    const errors = [];

    const mapped = {};
    const keyMap = {};
    Object.keys(raw).forEach((rawKey) => {
      const camelKey = this.snakeToCamel(rawKey);
      mapped[camelKey] = raw[rawKey];
      keyMap[camelKey] = rawKey;
    });

    const illegalFields = Object.keys(raw).filter(
      (rawKey) => !this.validFields.includes(this.snakeToCamel(rawKey))
    );
    if (illegalFields.length > 0) {
      errors.push(`Invalid fields: ${illegalFields.join(", ")}`);
    }

    this.requiredFields.forEach((camelKey) => {
      const rawKey = keyMap[camelKey] || this.camelToSnake(camelKey);
      if (
        mapped[camelKey] === undefined ||
        mapped[camelKey] === null ||
        mapped[camelKey] === ""
      ) {
        errors.push(`${rawKey} is required`);
      } else if (typeof mapped[camelKey] !== "string") {
        errors.push(`${rawKey} must be a string`);
      }
    });

    if (
      (!mapped.name || mapped.name === "") &&
      (!mapped.email || mapped.email === "")
    ) {
      errors.push("Either name or email is required");
    }

    if (mapped.name !== undefined && mapped.name !== null && mapped.name !== "") {
      const rawKey = keyMap.name || "name";
      if (typeof mapped.name !== "string") {
        errors.push(`${rawKey} must be a string`);
      }
    }

    if (mapped.email !== undefined && mapped.email !== null && mapped.email !== "") {
      const rawKey = keyMap.email || "email";
      if (typeof mapped.email !== "string") {
        errors.push(`${rawKey} must be a string`);
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(mapped.email)) {
          errors.push(`${rawKey} must be a valid email address`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : null,
    };
  }

  static fromRequest(req) {
    const raw = { ...req.body };

    const mapped = {};
    Object.keys(raw).forEach((key) => {
      const camelKey = this.snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = raw[key];
      }
    });

    return new AuthLoginDto(mapped);
  }
}

export class AuthLogoutDto {
  constructor({ userId }) {
    this.userId = userId;
  }

  static validFields = ["userId"];

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static validate(req) {
    const decoded = req?.decoded ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId
    };
    const errors = [];

    const illegalFields = Object.keys(raw).filter(
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
    const raw = { userId: decoded.userId };

    const mapped = {};
    Object.keys(raw).forEach((key) => {
      const camelKey = this.snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = raw[key];
      }
    });

    return new AuthLogoutDto(mapped);
  }
}
export class AuthGenerateTokenDto {
  constructor({ userId, stripeCusId }) {
    this.userId = userId;
    this.stripeCusId = stripeCusId;
  }

  static validFields = ["userId", "stripeCusId"];

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static validate(req) {
    const decoded = req?.decoded ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId,
      stripe_cus_id: decoded.stripe_cus_id,
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

    if (!mapped.userId) {
      errors.push("userId is required");
    }

    if (!mapped.stripeCusId || typeof mapped.stripeCusId !== "string") {
      errors.push("stripeCusId is required and must be a string");
    }

    return {
      valid: errors.length === 0,
      message: errors.length > 0 ? errors.join(", ") : null,
    };
  }

  static fromRequest(req) {
    const decoded = req?.decoded ?? {};
    const raw = {
      ...req.body,
      userId: decoded.userId,
      stripe_cus_id: decoded.stripe_cus_id,
    };

    const mapped = {};
    Object.keys(raw).forEach((key) => {
      const camelKey = this.snakeToCamel(key);
      if (this.validFields.includes(camelKey)) {
        mapped[camelKey] = raw[key];
      }
    });

    return new AuthGenerateTokenDto(mapped);
  }
}
