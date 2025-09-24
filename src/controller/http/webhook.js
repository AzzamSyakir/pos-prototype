import * as webhookServices from "#services/webhook";
import * as webhookDto from '#dto/webhook';

import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function UpdateTransactionStatus(req, res) {
  try {
    const validation = webhookDto.StripePaymentEventDto.validate(req);
    if (!validation.valid) {
      return res
        .status(400)
        .json(response.errorResponse(400, validation.message || "validation failed"));
    }
    const dto = webhookDto.StripePaymentEventDto.fromRequest(req);
    const result = await webhookServices.UpdateTransactionStatus(dto);
    if (!result.success) {
      return res
        .status(400)
        .json(response.errorResponse(400, result.message));
    }
    return res
      .status(200)
      .json(response.SuccessResponse(200, "Transaction Updated successfully", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}