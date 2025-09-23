import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

export class UserSeedData {
  constructor(count) {
    this.data = Array.from({ length: count }).map(() => {
      const plainPassword = faker.internet.password({ length: 10 });
      return {
        id: uuidv4(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        plainPassword,
        password: plainPassword,
        phoneNumber: "08" + faker.string.numeric(10),
        createdAt: new Date(),
        updatedAt: new Date(),
        stripeCustomerId: `cus_${faker.string.alphanumeric(14)}`,
      };
    });
  }
}
