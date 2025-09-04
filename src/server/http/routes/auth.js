import * as authController from "#controller/http/auth";
import express from "express";
import { CheckRefreshToken } from "#middleware/check_refresh_token";
import { CheckAccessToken } from "#middleware/check_access_token";
/**
 * @param {import('express').Express} app
 */
export function AuthRoutes(app) {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send("cihuy from auth");
  });

  router.post("/login", (req, res) => {
    authController.Login(req, res)
  });
  router.post("/register", (req, res) => {
    authController.Register(req, res)
  });
  router.post("/logout", CheckAccessToken, (req, res) => {
    authController.Logout(req, res)
  });
  router.post("/generate-token", CheckRefreshToken, (req, res) => {
    authController.generateNewToken(req, res)
  });

  app.use("/api/auths", router);
}
