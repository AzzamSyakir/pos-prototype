export class CapitalSeedData {
  constructor(userId, count) {
    this.data = Array.from({ length: count }).map(() => {
      return {
        id: uuidv4(),
        user_id: userId,
        amount: faker.number.int({ min: 1000, max: 100000 }),
        type: faker.helpers.arrayElement(['day', 'week', 'month', 'year']),
        created_at: new Date(),
        updated_at: new Date(),
      };
    });
  }
}