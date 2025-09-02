import * as authServices from "#services/auth";
import * as authDto from '#dto/auth';
import * as response from '#utils/response_utils'
/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */


export async function Register(req, res) {
  try {
    const validation = authDto.AuthRegisterDto.validateFormRequest(req.body);
    if (!validation.valid) {
      return res.status(400)
        .json(response.errorResponse(400, validation.message || "request validation failed"));
    }
    const dto = authDto.AuthRegisterDto.fromRequest(req.body);
    const result = await authServices.Register(dto);
    return res
      .status(200)
      .json(response.SuccessResponse(200, "Register success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
export async function Login(req, res) {
  try {
    const validation = authDto.AuthLoginDto.validateFormRequest(req.body);
    if (!validation.valid) {
      return res.status(400)
        .json(response.errorResponse(400, validation.message || "request validation failed"));
    }
    const dto = authDto.AuthLoginDto.fromRequest(req.body);
    const result = await authServices.Login(dto);
    return res
      .status(200)
      .json(response.SuccessResponse(200, "Login success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
export async function GenerateAccessToken(req, res) {
  try {
    const result = await authServices.GenerateAccessToken(req.decoded);
    return res
      .status(200)
      .json(response.SuccessResponse(200, "GenerateAccessToken success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}