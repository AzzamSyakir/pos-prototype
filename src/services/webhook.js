import { UserEntity } from '#entity/auth'
import * as stripeUtils from '#utils/stripe_utils'
import bcrypt from 'bcrypt'
import * as webhookRepo from '#repository/webhook'
import jwt from 'jsonwebtoken'
import env from "#config/env_config";
import redis from "#config/redis_config";
import * as authDto from '#dto/auth';

/**
 * @param {import('#dto/webhook').StripePaymentEventDto} dto
 */
export async function UpdateTransactionStatus(dto) {
  const currentTime = new Date();
  if (dto.status == 'paid') {
    dto.status = 'succeeded'
  }
  console.log(dto.status)
  await webhookRepo.UpdateTransactionStatusByPaymentId(dto.paymentId, dto.status, currentTime)

  return null
}
