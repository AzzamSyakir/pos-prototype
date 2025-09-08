import * as transactionServices from "#services/transaction";
import { StripePaymentIntentEventDto } from '#dto/webhook';
import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function UpdateTransactionStatus(req, res) {
  try {
    const validation = StripePaymentIntentEventDto.validateFormRequest(req.body);
    if (!validation.valid) {
      return res.status(400)
        .json(response.errorResponse(400, validation.message || "request validation failed"));
    }
    const dto = StripePaymentIntentEventDto.fromRequest(req.body);
    console.log(dto);
    const result = await transactionServices.CreateTransaction(dto);

    return res
      .status(200)
      .json(response.SuccessResponse(200, "Transaction Updated successfully", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}