import * as transactionServices from "#services/transaction";
import { TransactionDto } from '#dto/transaction';
import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function CreateTransaction(req, res) {
  try {
    const validation = TransactionDto.validateFormRequest(req.body);
    if (!validation.valid) {
      return res.status(400)
        .json(response.errorResponse(400, validation.message || "request validation failed"));
    }
    const dto = TransactionDto.fromRequest(req.body);
    dto.stripeCustomerId = req.decoded.stripe_cus_id;
    dto.userId = req.decoded.userId
    const result = await transactionServices.CreateTransaction(dto);

    return res
      .status(200)
      .json(response.SuccessResponse(200, "Transaction created successfully", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}