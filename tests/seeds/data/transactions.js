import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export class TransactionSeedData {
  constructor(userId, count) {
    this.data = Array.from({ length: count }).map(() => {
      return {
        id: uuidv4(),
        amount: parseFloat(faker.finance.amount({ min: 10000, max: 1000000, dec: 0 })),
        status: "succeeded",
        paymentMethod: faker.helpers.arrayElement(["card", "payment_link", "ach_direct_debit", "sepa_debit"]),
        user_id: userId,
        stripe_payment_id: `pi_${faker.string.alphanumeric(24)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
  }
}
