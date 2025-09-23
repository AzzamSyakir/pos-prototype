import request from 'supertest';
import { createApp } from '#httpServer';
import { UserSeeder } from "../seeds/script/seed_users.js";
const app = createApp();
describe('POST /api/auth/register', () => {
  const endpoint = '/api/auth/register';
  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };

  const userSeed = new UserSeeder(1);
  const [userData] = userSeed.userSeedData.data;

  const payload = {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    phone_number: userData.phoneNumber,
  };

  afterAll(async () => {
    await userSeed.Down();
  });

  it('should return success with status code 201 and message "Register success" when all fields are valid', async () => {
    const res = await request(app).post(endpoint).send(payload);
    userData.id = res.body.data.id;
    logOnFail(res, () => expect(res.body.code).toBe(201));
    logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    logOnFail(res, () => expect(res.body.data.email).toBe(userData.email));
    logOnFail(res, () => expect(res.body.message).toBe('Register success'));
  });

  it('should return error with status code 400 and message "name is required" when name is missing', async () => {
    const { name, ...invalidPayload } = payload;
    const res = await request(app).post(endpoint).send(invalidPayload);

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('name is required'));
  });

  it('should return error with status code 400 and message "email is required" when email is missing', async () => {
    const { email, ...invalidPayload } = payload;
    const res = await request(app).post(endpoint).send(invalidPayload);

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('email is required'));
  });

  it('should return error 400 when email already exists', async () => {
    const res = await request(app).post(endpoint).send({
      ...payload,
      name: 'Another User',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe(
        `Register failed : User with email ${userData.email} already exists`
      )
    );
  });

  it('should return error with status code 400 and message "password is required" when password is missing', async () => {
    const { password, ...invalidPayload } = payload;
    const res = await request(app).post(endpoint).send(invalidPayload);

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe('password is required'));
  });

  it('should return error with status code 400 and message "phone_number is required" when phone_number is missing', async () => {
    const { phone_number, ...invalidPayload } = payload;
    const res = await request(app).post(endpoint).send(invalidPayload);

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe('phone_number is required')
    );
  });

  const notallowedField = 'unawantedField';
  it(`should return error with status code 400 and message "Invalid fields: ${notallowedField}" when unwanted field is given`, async () => {
    const res = await request(app).post(endpoint).send({
      ...payload,
      [notallowedField]: 'unwanted',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe(`Invalid fields: ${notallowedField}`)
    );
  });
});
describe('POST /api/auth/login', () => {
  const endpoint = '/api/auth/login';
  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };

  const userSeed = new UserSeeder(1);
  const [userData] = userSeed.userSeedData.data;

  const payload = {
    email: userData.email,
    password: userData.password,
  };

  beforeAll(async () => {
    await userSeed.Up();
  });

  afterAll(async () => {
    await userSeed.Down();
  });

  it('should return success with status code 200 and message "Login success" and user will get access token and refresh token when using email and password', async () => {
    const res = await request(app).post(endpoint).send(payload);

    if (res.statusCode !== 200) {
      console.error('\n Unexpected response:');
      console.error(JSON.stringify(res.body, null, 2));
    }

    logOnFail(res, () => expect(res.body.code).toBe(200));
    logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    logOnFail(res, () =>
      expect(res.body.data).toHaveProperty('access_token')
    );
    logOnFail(res, () =>
      expect(res.body.data.access_token.expiry).toBe('5m')
    );
    logOnFail(res, () =>
      expect(res.body.data).toHaveProperty('refresh_token')
    );
    logOnFail(res, () =>
      expect(res.body.data.refresh_token.expiry).toBe('1d')
    );
    logOnFail(res, () => expect(res.body.message).toBe('Login success'));
  });

  it('should return success with status code 200 and message "Login success" and user will get access token and refresh token when using name and password', async () => {
    const res = await request(app).post(endpoint).send({
      name: userData.name,
      password: userData.password,
    });

    if (res.statusCode !== 200) {
      console.error('\n Unexpected response:');
      console.error(JSON.stringify(res.body, null, 2));
    }

    logOnFail(res, () => expect(res.body.code).toBe(200));
    logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    logOnFail(res, () =>
      expect(res.body.data).toHaveProperty('access_token')
    );
    logOnFail(res, () =>
      expect(res.body.data.access_token.expiry).toBe('5m')
    );
    logOnFail(res, () =>
      expect(res.body.data).toHaveProperty('refresh_token')
    );
    logOnFail(res, () =>
      expect(res.body.data.refresh_token.expiry).toBe('1d')
    );
    logOnFail(res, () => expect(res.body.message).toBe('Login success'));
  });

  it('should return error with status code 400 and message "Either name or email is required" when email and name are missing', async () => {
    const { email, name, ...invalidPayload } = payload;
    const res = await request(app).post(endpoint).send(invalidPayload);

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe('Either name or email is required')
    );
  });

  it('should return error with status code 400 and message "password is required" when password is missing', async () => {
    const { password, ...invalidPayload } = payload;
    const res = await request(app).post(endpoint).send(invalidPayload);

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe('password is required')
    );
  });

  const notallowedField = 'unawantedField';
  it(`should return error with status code 400 and message "Invalid fields: ${notallowedField}" when unwanted field is given`, async () => {
    const res = await request(app).post(endpoint).send({
      ...payload,
      [notallowedField]: 'unwanted',
    });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () =>
      expect(res.body.message).toBe(`Invalid fields: ${notallowedField}`)
    );
  });
});
describe('POST Logout', () => {
  const endpoint = '/api/auth/logout';
  let accessToken
  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };

  const userSeed = new UserSeeder(1);
  const [userData] = userSeed.userSeedData.data;

  const payload = {
    email: userData.email,
    password: userData.password,
  };

  beforeAll(async () => {
    await userSeed.Up();
    const loginRes = await request(app).post('/api/auth/login').send(payload)
    accessToken = loginRes.body.data.access_token.token;

  });

  afterAll(async () => {
    await userSeed.Down();
  });

  it('should return success with status code 200 and message "Logout success" when accessToken is valid', async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${accessToken}`)

    if (res.statusCode !== 200) {
      console.error('\n Unexpected response:');
      console.error(JSON.stringify(res.body, null, 2));
    }

    logOnFail(res, () => expect(res.body.code).toBe(200));
    logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    logOnFail(res, () => expect(res.body.message).toBe('Logout success'));
  });

  const notallowedField = 'unawantedField';
  it(`should return error with status code 400 and message "Invalid fields: ${notallowedField}" when unwanted field is given`, async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        [notallowedField]: 'unwanted',
      });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe(`Invalid fields: ${notallowedField}`));
  });
  it(`should return error with status code 401 and message "Authorization header is missing" when access token didnt provided in request`, async () => {
    const res = await request(app)
      .post(endpoint)
      .send();

    logOnFail(res, () => expect(res.statusCode).toBe(401));
    logOnFail(res, () => expect(res.body.code).toBe(401));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe(`Authorization header is missing`));
  });
});
describe('POST GenerateToken', () => {
  const endpoint = '/api/auth/generate-token';
  let refreshToken;

  const logOnFail = (res, fn) => {
    try {
      fn();
    } catch (err) {
      console.error('❌ Test failed. Response:', res.body);
      throw err;
    }
  };


  const userSeed = new UserSeeder(1);
  const [userData] = userSeed.userSeedData.data;

  const payload = {
    email: userData.email,
    password: userData.password,
  };

  beforeAll(async () => {
    await userSeed.Up();
    const loginRes = await request(app).post('/api/auth/login').send(payload)
    refreshToken = loginRes.body.data.refresh_token.token;

  });

  afterAll(async () => {
    await userSeed.Down();
  });

  it('should return success with status code 200 and message "GenerateToken success" and user will get new access token and refresh token when refreshToken is valid', async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${refreshToken}`)

    if (res.statusCode !== 200) {
      console.error('\n Unexpected response:');
      console.error(JSON.stringify(res.body, null, 2));
    }

    logOnFail(res, () => expect(res.body.code).toBe(200));
    logOnFail(res, () => expect(res.body).toHaveProperty('data'));
    logOnFail(res, () => expect(res.body.data).toHaveProperty('access_token'));
    logOnFail(res, () => expect(res.body.data.access_token.expiry).toBe('5m'));
    logOnFail(res, () => expect(res.body.data).toHaveProperty('refresh_token'));
    logOnFail(res, () => expect(res.body.data.refresh_token.expiry).toBe('1d'));
    logOnFail(res, () => expect(res.body.message).toBe('GenerateToken success'));
  });

  const notallowedField = 'unawantedField';
  it(`should return error with status code 400 and message "Invalid fields: ${notallowedField}" when unwanted field is given`, async () => {
    const res = await request(app)
      .post(endpoint)
      .set('Authorization', `Bearer ${refreshToken}`)
      .send({
        [notallowedField]: 'unwanted',
      });

    logOnFail(res, () => expect(res.statusCode).toBe(400));
    logOnFail(res, () => expect(res.body.code).toBe(400));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe(`Invalid fields: ${notallowedField}`));
  });
  it(`should return error with status code 401 and message "Authorization header is missing" when refresh token didnt provided in request`, async () => {
    const res = await request(app)
      .post(endpoint)
      .send();

    logOnFail(res, () => expect(res.statusCode).toBe(401));
    logOnFail(res, () => expect(res.body.code).toBe(401));
    logOnFail(res, () => expect(res.body.data).toBeNull());
    logOnFail(res, () => expect(res.body.message).toBe(`Authorization header is missing`));
  });
});
describe('CORS Headers on Auth Endpoints', () => {
  const endpoints = [
    { method: 'post', url: '/api/auth/register' },
    { method: 'post', url: '/api/auth/login' },
    { method: 'post', url: '/api/auth/logout' },
    { method: 'post', url: '/api/auth/generate-token' },
  ];

  endpoints.forEach(({ method, url }) => {
    it(`should return Access-Control-Allow-Origin * header for ${method.toUpperCase()} ${url}`, async () => {
      const res = await request(app)[method](url);
      expect(res.headers).toHaveProperty('access-control-allow-origin');
      expect(res.headers['access-control-allow-origin']).toBe('*');
    });
  });
});
