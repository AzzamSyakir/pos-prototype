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
    if (result.status === false) {
      return res
        .status(result.code)
        .json(response.SuccessResponse(result.code, `Register failed : ${result.message}`, result.data));
    }
    return res
      .status(201)
      .json(response.SuccessResponse(result.code, result.message, result.data));
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
    if (result.status === false) {
      return res
        .status(result.code)
        .json(response.SuccessResponse(result.code, `Login failed : ${result.message}`, result.data));
    }
    return res
      .status(200)
      .json(response.SuccessResponse(200, "Login success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
export async function Logout(req, res) {
  try {
    const result = await authServices.Logout(req.decoded);
    return res
      .status(200)
      .json(response.SuccessResponse(200, "Logout success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}
export async function generateNewToken(req, res) {
  try {
    const result = await authServices.GenerateToken(req.decoded);
    return res
      .status(200)
      .json(response.SuccessResponse(200, "GenerateToken success", result));
  } catch (err) {
    return res
      .status(500)
      .json(response.errorResponse(500, err.message || "Internal server error"));
  }
}