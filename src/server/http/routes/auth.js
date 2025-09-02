import * as authController from "#controller/http/auth";
import express from "express";
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

  app.use("/api/auths", router);
}
