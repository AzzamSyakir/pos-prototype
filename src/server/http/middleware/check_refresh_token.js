import env from "#config/env_config";
import jwt from "jsonwebtoken";
import * as response from "#utils/response_utils";
import redisClient from "#config/redis_config";

export async function CheckRefreshToken(req, res, next) {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
      return res
        .status(401)
        .json(response.errorResponse(401, "Authorization header is missing"));
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res
        .status(401)
        .json(response.errorResponse(401, "Invalid Authorization format"));
    }

    const token = parts[1];
    const decoded = jwt.verify(token, env.app.jwtSecret);
    const userId = decoded.userId;

    if (!userId) {
      return res
        .status(401)
        .json(response.errorResponse(401, "Invalid token payload"));
    }

    const redisKey = `refresh_token:${userId}`;
    const storedData = await redisClient.get(redisKey);

    if (!storedData) {
      return res
        .status(401)
        .json(response.errorResponse(401, "Refresh token not found"));
    }

    let parsed;
    try {
      parsed = JSON.parse(storedData);
    } catch (err) {
      return res
        .status(500)
        .json(response.errorResponse(500, "Invalid refresh token format in store"));
    }

    if (parsed.token !== token) {
      return res
        .status(401)
        .json(response.errorResponse(401, "Refresh token mismatched"));
    }

    if (parsed.expiry) {
      const expiry = new Date(parsed.expiry).getTime();
      const now = Date.now();
      if (now > expiry) {
        return res
          .status(401)
          .json(response.errorResponse(401, "Refresh token expired"));
      }
    }

    req.decoded = decoded;
    return next();
  } catch (err) {
    return res
      .status(401)
      .json(response.errorResponse(401, "Invalid or expired token"));
  }
}
