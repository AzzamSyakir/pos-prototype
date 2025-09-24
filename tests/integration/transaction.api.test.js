import request from 'supertest';
import { createApp } from '#httpServer';
import { UserSeeder } from "../seeds/script/seed_users.js";
import { TransactionSeeder } from "../seeds/script/seed_transactions.js";

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

describe('POST /api/transaction (CreateTransaction)', () => {
  let transactionSeeder;
  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };

  beforeEach(() => {
    transactionSeeder = new TransactionSeeder();
  });

  afterEach(async () => {
    await transactionSeeder.Down();
  });

  const endpoint = '/api/transaction';

  describe('✅ Success Cases', () => {
    it('should create transaction with valid payload', async () => {
      const payload = {
        payment_method: 'card',
        amount: 10000,
      };

      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      logOnFail(res, () => expect(res.statusCode).toBe(201));
      logOnFail(res, () => expect(res.body.data).toHaveProperty('id'));
      logOnFail(res, () => expect(res.body.data.amount).toBe(payload.amount.toFixed(2)));
      logOnFail(res, () => expect(res.body.message).toBe('Transaction created successfully'));

      transactionSeeder.transactionSeedData.data.push({
        id: res.body.data.id,
        user_id: res.body.data.user_id,
        amount: res.body.data.amount,
        status: res.body.data.status,
        paymentMethod: res.body.data.payment_method,
        stripe_payment_id: res.body.data.stripe_payment_id ?? null,
        createdAt: res.body.data.created_at,
        updatedAt: res.body.data.updated_at,
      });
    });
  });

  describe('❌ Validation Errors', () => {
    it('should fail when amount is missing', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ payment_method: 'card' });

      logOnFail(res, () => expect(res.statusCode).toBe(400));
      logOnFail(res, () => expect(res.body.message).toContain('amount is required'));
    });

    it('should fail when payment_method is invalid', async () => {
      const res = await request(app)
        .post(endpoint)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ amount: 10000, payment_method: 'bitcoin' });

      logOnFail(res, () => expect(res.statusCode).toBe(400));
      logOnFail(res, () => expect(res.body.message).toContain(
        'paymentMethod must be one of: payment_link, card, ach_direct_debit, sepa_debit'
      ));
    });
  });

  describe('⚠️ Edge Cases', () => {
    it('should fail when no auth token is provided', async () => {
      const res = await request(app).post(endpoint).send({
        amount: 10000,
        payment_method: 'card',
      });

      logOnFail(res, () => expect(res.statusCode).toBe(401));
    });
  });
});

describe('GET /api/transaction (FetchTransaction)', () => {
  let transactionSeed;
  let endpoint = '/api/transaction';

  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };

  beforeEach(async () => {
    transactionSeed = new TransactionSeeder(userData.id, 3);
    await transactionSeed.Up();
  });

  afterEach(async () => {
    await transactionSeed.Down();
  });

  describe('✅ Success Cases', () => {
    it('should fetch list of transactions', async () => {
      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${accessToken}`);

      logOnFail(res, () => expect(res.statusCode).toBe(200));
      logOnFail(res, () => expect(Array.isArray(res.body.data)).toBe(true));
      logOnFail(res, () => expect(res.body.data.length).toBeGreaterThan(0));
      logOnFail(res, () => expect(res.body.data[0]).toHaveProperty('id'));
      logOnFail(res, () => expect(res.body.data[0]).toHaveProperty('amount'));
    });
  });

  describe('⚠️ Edge Cases', () => {
    it('should return error if no transactions exist', async () => {
      await transactionSeed.Down();
      const res = await request(app)
        .get(endpoint)
        .set('Authorization', `Bearer ${accessToken}`);

      logOnFail(res, () => expect(res.statusCode).toBe(400));
      logOnFail(res, () => expect(res.body.data).toEqual(null));
    });

    it('should fail when no auth token is provided', async () => {
      const res = await request(app).get(endpoint);

      logOnFail(res, () => expect(res.statusCode).toBe(401));
    });
  });
});

describe('CORS Headers on transaction Endpoints', () => {
  const corsEndpoints = [
    { method: 'post', path: '/api/transaction' },
    { method: 'get', path: '/api/transaction' },
  ];

  describe.each(corsEndpoints)('$method $path', ({ method, path }) => {
    it(`should return Access-Control-Allow-Origin *`, async () => {
      const res = await request(app)[method](path)
        .set('Origin', 'http://example.com');

      expect(res.headers).toHaveProperty('access-control-allow-origin');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
