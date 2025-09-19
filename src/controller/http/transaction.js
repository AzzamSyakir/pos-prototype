import * as transactionServices from "#services/transaction";
import * as transactionDto from '#dto/transaction';
import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function CreateTransaction(req, res) {
  try {
    const validation = transactionDto.TransactionDto.validate(req);
    if (!validation.valid) {
      return res
        .status(400)
        .json(response.errorResponse(400, validation.message || "validation failed"));
    }
    const dto = transactionDto.TransactionDto.fromRequest(req);
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

export async function FetchTransaction(req, res) {
  try {
    const userId = req.decoded.userId;
    const serviceResult = await transactionServices.FetchTransaction(userId);

    if (!serviceResult.success) {
      return res
        .status(404)
        .json(response.errorResponse(404, serviceResult.message));
    }

    return res
      .status(200)
      .json(response.SuccessResponse(200, serviceResult.message, serviceResult.data));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}