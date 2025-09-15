import { UserEntity } from '#entity/auth'
import * as stripeUtils from '#utils/stripe_utils'
import bcrypt from 'bcrypt'
import * as authRepo from '#repository/auth'
import jwt from 'jsonwebtoken'
import env from "#config/env_config";
import redis from "#config/redis_config";
import * as authDto from '#dto/auth';

/**
 * @param {import('#dto/auth').AuthRegisterDto} dto
 */

export async function Register(dto) {
  try {
    const existingUser = await authRepo.FindUserByEmailOrPhone(dto.email, dto.phoneNumber);
    if (existingUser) {
      let foundField;
      let foundValue;

      if (existingUser.email === dto.email) {
        foundField = 'email';
        foundValue = dto.email;
      } else if (existingUser.phone_number === dto.phoneNumber) {
        foundField = 'phone_number';
        foundValue = dto.phoneNumber;
      }

      return {
        status: false,
        data: null,
        code: 400,
        message: `User with ${foundField} ${foundValue} already exists`,
      };
    }

    const saltRounds = 12;
    const hashPassword = await bcrypt.hash(dto.password, saltRounds);

    const user = new UserEntity(
      crypto.randomUUID(),
      dto.name,
      dto.email,
      hashPassword,
      dto.phoneNumber
    );

    const stripeCustomer = await stripeUtils.CreateCustomer(user);
    user.stripe_customer_id = stripeCustomer.id;

    const currentTime = new Date();
    const result = await authRepo.CreateUser(user, currentTime);
    return {
      status: true,
      data: result,
      code: 201,
      message: 'Register success',
    };
  } catch (err) {
    return {
      status: false,
      data: null,
      code: 500,
      message: `Internal server error ${err}`,
    };
  }
}

/**
 * @param {import('#dto/auth').AuthLoginDto} dto
 */

export async function Login(dto) {
  try {
    if (!dto.password) {
      return {
        status: false,
        data: null,
        code: 400,
        message: "Password is required",
      };
    }

    const authMethods = {
      email: authRepo.GetUserCredentialsByEmail,
      name: authRepo.GetUserCredentialsByName,
    };

    const foundField = Object.keys(authMethods).find((f) =>
      authDto.AuthLoginDto.isNonEmptyString(dto[f])
    );

    if (!foundField) {
      return {
        status: false,
        data: null,
        code: 400,
        message: "Either email or name is required for login",
      };
    }

    const user = await authMethods[foundField](dto[foundField]);

    if (!user) {
      return {
        status: false,
        data: null,
        code: 404,
        message: `User with ${foundField} "${dto[foundField]}" not found`,
      };
    }

    const matchPassword = await bcrypt.compare(dto.password, user.password);
    if (!matchPassword) {
      return {
        status: false,
        data: null,
        code: 401,
        message: "Invalid password",
      };
    }

    const jwtPayload = {
      userId: user.id,
      stripe_cus_id: user.stripe_customer_id,
      [foundField]: user[foundField],
    };

    const accessExpiry = env.app.accessTokenExpiry || "5m";
    const refreshExpiry = env.app.refreshTokenExpiry || "1d";

    const accessToken = jwt.sign(jwtPayload, env.app.jwtSecret, {
      expiresIn: accessExpiry,
    });

    const refreshToken = jwt.sign(jwtPayload, env.app.jwtSecret, {
      expiresIn: refreshExpiry,
    });

    const redisKeyRefreshToken = `refresh_token:${user.id}`;
    const redisPayloadRefreshToken = {
      token: refreshToken,
      expiry: refreshExpiry,
    };

    await redis.set(redisKeyRefreshToken, JSON.stringify(redisPayloadRefreshToken));

    return {
      status: true,
      code: 200,
      message: "Login successful",
      data: {
        access_token: {
          token: accessToken,
          expiry: accessExpiry,
        },
        refresh_token: {
          token: refreshToken,
          expiry: refreshExpiry,
        },
      },
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      status: false,
      data: null,
      code: 500,
      message: "Internal server error",
    };
  }
}

export async function Logout(decodedData) {
  if (!decodedData.userId) {
    throw new Error("Invalid user data");
  }

  const refreshTokenRedisKey = `refresh_token:${decodedData.userId}`;
  const deletedCount = await redis.del(refreshTokenRedisKey);

  if (deletedCount === 0) {
    throw new Error("No refresh token found");
  }

  return { key: refreshTokenRedisKey };
}


export async function GenerateToken(decodedData) {

  var jwtPayload = {
    userId: decodedData.userId,
    stripe_cus_id: decodedData.stripe_cus_id,
  };
  var accessExpiry = env.app.accessTokenExpiry || "5m";
  var accessToken = jwt.sign(jwtPayload, env.app.jwtSecret, { expiresIn: accessExpiry });

  var refreshExpiry = env.app.accesrefreshTokenExpiry || "1d";
  var refreshToken = jwt.sign(jwtPayload, env.app.jwtSecret, { expiresIn: refreshExpiry });

  const redisKeyRefreshToken = `refresh_token:${decodedData.id}`;

  const redisPayloadRefreshToken = {
    token: refreshToken,
    expiry: refreshExpiry,
  };

  await redis.set(redisKeyRefreshToken, JSON.stringify(redisPayloadRefreshToken));
  return {
    access_token: {
      token: accessToken,
      expiry: accessExpiry,
    },
    refresh_token: {
      token: refreshToken,
      expiry: refreshExpiry,
    },
  };
}
