import * as calculateServices from "#services/finance";
import * as financeDto from '#dto/finance';
import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function CalculateFinanceSummary(req, res) {
  try {
    const validation = financeDto.CalculateFinanceSummaryDto.validate(req);
    if (!validation.valid) {
      return res
        .status(400)
        .json(response.errorResponse(400, validation.message || "validation failed"));
    }
    const dto = financeDto.CalculateFinanceSummaryDto.fromRequest(req);
    const result = await calculateServices.CalculateFinanceSummary(dto);
    if (result.status === false) {
      return res
        .status(result.code)
        .json(response.SuccessResponse(result.code, `calculate summary failed : ${result.message}`, result.data));
    }
    return res
      .status(result.code)
      .json(response.SuccessResponse(result.code, result.message, result.data));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
export async function AddCapital(req, res) {
  try {
    const validation = financeDto.AddCapitalDto.validate(req);
    if (!validation.valid) {
      return res
        .status(400)
        .json(response.errorResponse(400, validation.message || "validation failed"));
    }
    const dto = financeDto.AddCapitalDto.fromRequest(req);;
    const result = await calculateServices.AddCapital(dto);
    if (result.status === false) {
      return res
        .status(result.status)
        .json(response.SuccessResponse(result.status, `Add Capital record failed : ${result.message}`, result.data));
    }
    return res
      .status(result.code)
      .json(response.SuccessResponse(result.code, result.message, result.data));
  } catch (err) {
    return res
      .status(400)
      .json(response.errorResponse(400, `Add Capital record failed : ${err.message} || "Internal server error"`));
  }
}

