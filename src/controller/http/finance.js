import * as calculateServices from "#services/finance";
import { CalculateFinanceSummaryDto, AddCapitalDto } from '#dto/finance';
import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function CalculateFinanceSummary(req, res) {
  try {
    const dto = new CalculateFinanceSummaryDto({ targetLevel: req.params.targetLevel, userId: req.decoded.userId })
    const result = await calculateServices.CalculateFinanceSummary(dto);
    if (result.status === false) {
      return res
        .status(result.code)
        .json(response.SuccessResponse(result.code, `calculate summary failed : ${result.message}`, result.data));
    }
    return res
      .status(200)
      .json(response.SuccessResponse(200, "calculate summary success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
export async function AddCapital(req, res) {
  try {
    const dto = new AddCapitalDto({ amount: req.body.amount, targetLevel: req.params.targetLevel, userId: req.decoded.userId })
    const result = await calculateServices.AddCapital(dto);
    if (result.status === false) {
      return res
        .status(500)
        .json(response.SuccessResponse(500, `Add Capital record failed : ${result.message}`, result.data));
    }
    return res
      .status(200)
      .json(response.SuccessResponse(201, "Add Capital successfully", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}

