import * as calculateController from "#controller/http/calculate";
import express from "express";
import { CheckAccessToken } from "#middleware/check_access_token";
/**
 * @param {import('express').Express} app
 */
export function CalculateRoutes(app) {
  const router = express.Router();
  router.use(CheckAccessToken);

  router.get("/summary/:targetLevel", calculateController.CalculateSummary);
  router.post("/add-capital/:targetLevel", calculateController.AddCapital);
  app.use("/api/calculate", router);
}
