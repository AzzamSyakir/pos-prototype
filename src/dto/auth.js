export class AuthRegisterDto {
  constructor({ name, email, password, phoneNumber }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.phoneNumber = phoneNumber;
  }

  static validFields = ["name", "email", "password", "phone_number"];

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }

  static fromRequest(body) {
    const camelBody = {};
    Object.keys(body).forEach((k) => {
      const camelKey = AuthRegisterDto.snakeToCamel(k);
      camelBody[camelKey] = body[k];
    });
    return new AuthRegisterDto(camelBody);
  }

  static validateFormRequest(body) {
    const errors = [];

    const safeBody = body ?? {};

    Object.keys(safeBody).forEach((k) => {
      if (!AuthRegisterDto.validFields.includes(k)) {
        errors.push(`field ${k} is not allowed`);
      }
    });

    ["name", "email", "password", "phone_number"].forEach((f) => {
      const value = safeBody[f];
      if (value === undefined || value === null || value.toString().trim() === "") {
        errors.push(`${f} is required`);
      }
    });

    ["name", "email", "password", "phone_number"].forEach((f) => {
      const value = safeBody[f];
      if (value !== undefined && value !== null && typeof value !== "string") {
        errors.push(`${f} must be a string`);
      }
    });

    if (safeBody.email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(safeBody.email)) {
        errors.push(`email must be a valid email address`);
      }
    }

    return {
      valid: errors.length === 0,
      message: errors.join(", "),
    };
  }
}
export class AuthLoginDto {
  constructor({ name, email, password, phoneNumber }) {
    this.name = name;
    this.email = email;
    this.password = password;
  }

  static validFields = ["name", "email", "password"];

  static snakeToCamel(str) {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
  }
  static isNonEmptyString(val) {
    return (
      typeof val === "string" &&
      val.trim() !== "" &&
      val !== "undefined" &&
      val !== "null"
    );
  }


  static fromRequest(body) {
    const camelBody = {};
    Object.keys(body).forEach((k) => {
      const camelKey = AuthLoginDto.snakeToCamel(k);
      camelBody[camelKey] = body[k];
    });
    return new AuthLoginDto(camelBody);
  }

  static validateFormRequest(body) {
    const errors = [];

    const safeBody = body ?? {};

    Object.keys(safeBody).forEach((k) => {
      if (!AuthLoginDto.validFields.includes(k)) {
        errors.push(`field ${k} is not allowed`);
      }
    });
    if ((!safeBody.name || safeBody.name.toString().trim() === "") &&
      (!safeBody.email || safeBody.email.toString().trim() === "")) {
      errors.push("Either name or email is required");
    }

    if (!safeBody.password || safeBody.password.toString().trim() === "") {
      errors.push("password is required");
    }

    ["name", "email", "password"].forEach((f) => {
      const value = safeBody[f];
      if (value !== undefined && value !== null && typeof value !== "string") {
        errors.push(`${f} must be a string`);
      }
    });

    if (safeBody.email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(safeBody.email)) {
        errors.push(`email must be a valid email address`);
      }
    }

    return {
      valid: errors.length === 0,
      message: errors.join(", "),
    };
  }
}
