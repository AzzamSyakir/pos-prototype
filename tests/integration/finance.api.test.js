import request from 'supertest';
import { createApp } from '#httpServer';
import { UserSeeder } from "../seeds/script/seed_users.js";
import { TransactionSeeder } from "../seeds/script/seed_transactions.js";
import { CapitalSeeder } from "../seeds/script/seed_capitals.js";

const app = createApp();
let accessToken;
let userSeed;
let userData;

beforeAll(async () => {
  userSeed = new UserSeeder(1);
  await userSeed.Up();
  [userData] = userSeed.userSeedData.data;

  const payload = { email: userData.email, password: userData.password };
  const loginRes = await request(app).post('/api/auth/login').send(payload);
  accessToken = loginRes.body.data.access_token.token;
});

afterAll(async () => {
  await userSeed.Down();
});
describe('Add Capital', () => {
  const types = ['day', 'week', 'month', 'year'];
  const capitalSeeder = new CapitalSeeder();
  afterAll(async () => {
    await capitalSeeder.Down();
  });

  describe.each(types)('TargetType: %s', (type) => {
    const amount = 10000;
    const endpoint = `/api/finance/add-capital/${type}`;

    const logOnFail = (res, fn) => {
      try {
        fn();
      } catch (err) {
        console.error('❌ Test failed. Response:', res.body);
        throw err;
      }
    };

    it('✅ should return success (201) when all fields are valid', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount });

      logOnFail(res, () => expect(res.body.code).toBe(201));
      logOnFail(res, () => expect(res.body.data.amount).toBe(amount.toFixed(2)));
      logOnFail(res, () => expect(res.body.data.type).toBe(type));
      logOnFail(res, () => expect(res.body.message).toBe('Add Capital Success'));

      capitalSeeder.capitalSeedData.data.push({
        id: res.body.data.id,
        user_id: res.body.data.user_id,
        amount: res.body.data.amount,
        type: res.body.data.type,
        createdAt: res.body.data.created_at,
        updatedAt: res.body.data.updated_at,
      });
    });
  });
});
describe('Calculate Summary API', () => {
  const levels = ['day', 'week', 'month', 'year'];
  const endpoint = (type) => `/api/finance/calculate/summary/${type}`;

  const logOnFail = (res, fn) => {
    try { fn(); } catch (err) { console.error(`❌ Test failed. Response for ${res.req.path}:`, res.body); throw err; }
  };

  describe.each(levels)('TargetLevel: %s', (targetLevel) => {
    let transactionSeed;

    beforeAll(async () => {
      transactionSeed = new TransactionSeeder(userData.id, 1);
      await transactionSeed.Up();
    });

    afterAll(async () => {
      await transactionSeed.Down();
    });

    it('should return 400 when targetLevel is invalid', async () => {
      const res = await request(app)
        .get(endpoint('invalidType'))
        .set('Authorization', `Bearer ${accessToken}`);

      logOnFail(res, () => expect(res.statusCode).toBe(400));
      logOnFail(res, () => expect(res.body.code).toBe(400));
      logOnFail(res, () =>
        expect(res.body.message).toMatch(/targetLevel must be one of: day, week, month, year/)
      );
    });

    it('should return 401 when no token is provided', async () => {
      const res = await request(app).get(endpoint(targetLevel));
      logOnFail(res, () => expect(res.statusCode).toBe(401));
      logOnFail(res, () => expect(res.body.code).toBe(401));
      logOnFail(res, () =>
        expect(res.body.message).toMatch(/Authorization header is missing/i)
      );
    });

    it('should handle negative profit correctly', async () => {
      const res = await request(app)
        .get(endpoint(targetLevel))
        .set('Authorization', `Bearer ${accessToken}`);
      logOnFail(res, () => expect(res.statusCode).toBe(200));
      logOnFail(res, () => expect(res.body).toHaveProperty('data'));
      logOnFail(res, () =>
        expect(!isNaN(parseFloat(res.body.data.omzet))).toBe(true)
      );
      logOnFail(res, () =>
        expect(!isNaN(parseFloat(res.body.data.profit))).toBe(true)
      );
    });

    it('should return 200 when transaction available', async () => {
      const res = await request(app)
        .get(endpoint(targetLevel))
        .set('Authorization', `Bearer ${accessToken}`);
      logOnFail(res, () => expect(res.statusCode).toBe(200));
      logOnFail(res, () => expect(res.body.code).toBe(200));
      logOnFail(res, () =>
        expect(res.body.message).toBe('CalculateSummary Success')
      );
      logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    });

    it('should return 500 when transaction is empty', async () => {
      await transactionSeed.Down();
      const res = await request(app)
        .get(endpoint(targetLevel))
        .set('Authorization', `Bearer ${accessToken}`);
      logOnFail(res, () => expect(res.statusCode).toBe(500));
      logOnFail(res, () => expect(res.body.code).toBe(500));
      logOnFail(res, () => expect(res.body.data).toBeNull());
      logOnFail(res, () => expect(res.body.message).toMatch(/Transaction not found/));
      await transactionSeed.Up();
    });
  });
});

describe('CORS Headers on finance Endpoints', () => {
  const corsEndpoints = [
    { method: 'post', url: (lvl) => `/api/finance/add-capital/${lvl}` },
    { method: 'post', url: (lvl) => `/api/finance/calculate-summary-${lvl}` },
  ];
  const levels = ['day', 'week', 'month', 'year'];

  describe.each(levels)('TargetLevel: %s', (level) => {
    corsEndpoints.forEach(({ method, url }) => {
      it(`should return Access-Control-Allow-Origin * for ${method.toUpperCase()} ${url(level)}`, async () => {
        const res = await request(app)[method](url(level))
          .set('Authorization', `Bearer ${accessToken}`);
        expect(res.headers).toHaveProperty('access-control-allow-origin');
        expect(res.headers['access-control-allow-origin']).toBe('*');
      });
    });
  });
});
