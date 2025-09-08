import { UserEntity } from '#entity/auth'
import * as stripeUtils from '#utils/stripe_utils'
import bcrypt from 'bcrypt'
import * as webhookRepo from '#repository/webhook'
import jwt from 'jsonwebtoken'
import env from "#config/env_config";
import redis from "#config/redis_config";
import * as authDto from '#dto/auth';

/**
 * @param {import('#dto/webhook').StripePaymentIntentEventDto} dto
 */
export async function UpdateTransactionStatus(dto) {
  const user = await webhookRepo.GetUserByStripeCustomerId(dto.customer)
  const userId = user?.id;

  console.log(`userId : ${userId}`)
  console.log(`type : ${dto.type}`)

  const currentTime = new Date();
  await webhookRepo.UpdateLatestTransactionStatusByUserId(userId, dto.type, currentTime)

  return null
}
