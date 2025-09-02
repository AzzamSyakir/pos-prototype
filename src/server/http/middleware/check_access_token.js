import env from "#config/env_config";
import jwt from "jsonwebtoken";
import * as response from '#utils/response_utils'
export function CheckAccessToken(req, res, next) {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return res.status(401).json(response.errorResponse(401, "Authorization header is missing"));
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json(response.errorResponse(401, "Invalid Authorization format"));
    }

    const token = parts[1];

    const decoded = jwt.verify(token, env.app.jwtSecret);

    req.user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json(response.errorResponse(401, "Invalid or expired token"));
  }
}
