import * as calculateController from "#controller/http/finance";
import express from "express";
import { CheckAccessToken } from "#middleware/check_access_token";
/**
 * @param {import('express').Express} app
 */
export function FinanceRoutes(app) {
  const router = express.Router();
  router.use(CheckAccessToken);

  router.get("/calculate/summary/:targetLevel", calculateController.CalculateFinanceSummary);
  router.post("/add-capital/:targetLevel", calculateController.AddCapital);
  app.use("/api/finance", router);
}
