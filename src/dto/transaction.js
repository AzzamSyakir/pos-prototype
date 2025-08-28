export class TransactionDto {
  constructor({ amount, paymentMethod, accountholderName, accountNumber, routingNumber, iban, email }) {
    this.amount = amount;
    this.paymentMethod = paymentMethod;
    this.accountholderName = accountholderName;
    this.accountNumber = accountNumber;
    this.routingNumber = routingNumber;
    this.iban = iban;
    this.email = email;
  }

  static validFields = [
    'amount',
    'paymentMethod',
    'accountholderName',
    'accountNumber',
    'routingNumber',
    'iban',
    'email'
  ];

  static paymentMethods = ['payment_link', 'card', 'ach_direct_debit', 'sepa_debit'];

  static optionalFieldsRules = [
    { fields: ['accountholderName'], allowed: ['ach_direct_debit', 'sepa_debit'] },
    { fields: ['accountNumber', 'routingNumber'], allowed: ['ach_direct_debit'] },
    { fields: ['iban', 'email'], allowed: ['sepa_debit'] }
  ];

  static stringFields = ['accountholderName', 'accountNumber', 'routingNumber', 'iban', 'email'];

  static requiredFields = ['amount', 'paymentMethod'];

  static fromRequest(body) {
    const camelBody = {};
    Object.keys(body).forEach(k => {
      const camelKey = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      camelBody[camelKey] = body[k];
    });
    return new TransactionDto(camelBody);
  }

  static validateFormRequest(body) {
    const errors = [];
    const pm = body.payment_method;

    const missing = TransactionDto.requiredFields.filter(f => {
      const snake = f.replace(/([A-Z])/g, '_$1').toLowerCase();
      return body[snake] === undefined;
    });
    missing.forEach(f => errors.push(`${f} is required`));

    if (pm && !TransactionDto.paymentMethods.includes(pm)) {
      errors.push(`payment_method must be one of: ${TransactionDto.paymentMethods.join(', ')}`);
    }
    TransactionDto.optionalFieldsRules.forEach(rule => {
      const invalid = rule.fields
        .map(f => f.replace(/([A-Z])/g, '_$1').toLowerCase())
        .filter(snake => body[snake] !== undefined && !rule.allowed.includes(pm));

      if (invalid.length > 0) {
        errors.push(`field ${invalid.join(' and ')} ${invalid.length > 1 ? 'are' : 'is'} only allowed for ${rule.allowed.join(' or ')}`);
      }
    });


    TransactionDto.stringFields.forEach(f => {
      const snake = f.replace(/([A-Z])/g, '_$1').toLowerCase();
      if (body[snake] !== undefined && typeof body[snake] !== 'string') {
        errors.push(`${snake} must be a string`);
      }
    });

    Object.keys(body).forEach(k => {
      const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      if (!TransactionDto.validFields.includes(camel)) {
        errors.push(`field ${k} is not allowed`);
      }
    });

    return {
      valid: errors.length === 0,
      message: errors.join(', ')
    };
  }
}
