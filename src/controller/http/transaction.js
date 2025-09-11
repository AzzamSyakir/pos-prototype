import * as transactionServices from "#services/transaction";
import { TransactionDto, TransactionSummary } from '#dto/transaction';
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
    dto.userId = req.decoded.userId;
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

export async function CalculateSummary(req, res) {
  try {
    const dto = new TransactionSummary({ targetLevel: req.params.targetLevel })
    const userId = req.decoded.userId;
    const result = await transactionServices.CalculateSummary(userId, dto);
    if (result.status === false) {
      return res
        .status(500)
        .json(response.SuccessResponse(500, `calculate transaction failed : ${result.message}`, result.data));
    }
    return res
      .status(200)
      .json(response.SuccessResponse(200, "transaction calculated successfully", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
