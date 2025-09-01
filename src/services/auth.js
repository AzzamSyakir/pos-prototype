import { UserEntity } from '#entity/auth'
import * as stripeUtils from '#utils/stripe_utils'
import bcrypt from 'bcrypt'
import * as authRepo from '#repository/auth'
import jwt from 'jsonwebtoken'
import env from "#config/env_config";
import * as authDto from '#dto/auth';

/**
 * @param {import('#dto/auth').AuthRegisterDto} dto
 */
export async function Register(dto) {
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
  const result = authRepo.CreateUser(user, currentTime);
  return result
}
/**
 * @param {import('#dto/auth').AuthLoginDto} dto
 */

export async function Login(dto) {
  var user;

  var authMethods = {
    email: authRepo.GetUserCredentialsByEmail,
    name: authRepo.GetUserCredentialsByName,
  };

  var foundField = Object.keys(authMethods).find((f) =>
    authDto.AuthLoginDto.isNonEmptyString(dto[f])
  );

  user = await authMethods[foundField](dto[foundField]);
  if (!user) {
    throw new Error(`User with ${foundField} ${dto[foundField]} not found`);
  }

  var matchPassword = await bcrypt.compare(dto.password, user.password);
  if (!matchPassword) {
    throw new Error("Invalid credentials");
  }

  var payload = {
    stripe_cus_id: user.stripe_customer_id,
    [foundField]: user[foundField]
  };

  var accessExpiry = env.app.accessTokenExpiry || "5m";
  var refreshExpiry = env.app.accesrefreshTokenExpiry || "1d";

  var accessToken = jwt.sign(payload, env.app.jwtSecret, { expiresIn: accessExpiry });
  var refreshToken = jwt.sign(payload, env.app.jwtSecret, { expiresIn: refreshExpiry });

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
