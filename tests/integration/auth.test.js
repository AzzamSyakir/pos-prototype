import request from 'supertest';
import { newServer } from '#httpServer';

describe('POST /api/auth/register', () => {
  const endpoint = '/api/auth/register';
  const app = newServer();

  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };
  it('should return success with status code 201 and message "Register success" when all fields are valid', async () => {
    const res = await request(app).post(endpoint).send({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      phone_number: '081234567891',
    });

    if (res.statusCode !== 201) {
      console.error('\n Unexpected response:');
      console.error(JSON.stringify(res.body, null, 2));
    }

    logOnFail(res, () => expect(res.body.code).toBe(201));
    logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    logOnFail(res, () => expect(res.body.data.email).toBe('user@test.com'));
    logOnFail(res, () => expect(res.body.message).toBe('Register success'));
    console.log(res.body)
  });

  it('should return error with status code 400 and message "name is required" when name is missing', async () => {
    const res = await request(app).post(endpoint).send({
      email: 'user@test.com',
      password: 'password123',
      phone_number: '081234567890',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('name is required'));
  });

  it('should return error with status code 400 and message "email is required" when email is missing', async () => {
    const res = await request(app).post(endpoint).send({
      name: 'Test User',
      password: 'password123',
      phone_number: '081234567890',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('email is required'));
  });

  it('should return error 400 when email already exists', async () => {
    const payload = {
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
      phone_number: '081234567890',
    };

    const res = await request(app).post(endpoint).send({
      ...payload,
      name: 'test user',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe(
        `Register failed : User with email ${payload.email} already exists`
      )
    );
  });

  it('should return error with status code 400 and message "password is required" when password is missing', async () => {
    const res = await request(app).post(endpoint).send({
      name: 'Test User',
      email: 'user@test.com',
      phone_number: '081234567890',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('password is required'));
  });

  it('should return error with status code 400 and message "phone_number is required" when phone_number is missing', async () => {
    const res = await request(app).post(endpoint).send({
      name: 'Test User',
      email: 'user@test.com',
      password: 'password123',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('phone_number is required'));
  });
});
