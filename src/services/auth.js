import { UserEntity } from '#entity/auth'
import * as stripeUtils from '#utils/stripe_utils'
import bcrypt from 'bcrypt'
import * as authRepo from '#repository/auth'
/**
 * @param {import('#dto/auth').AuthDto} dto
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