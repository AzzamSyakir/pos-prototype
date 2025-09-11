import * as transactionController from "#controller/http/transaction";
import express from "express";
import { CheckAccessToken } from "#middleware/check_access_token";
/**
 * @param {import('express').Express} app
 */
export function TransactionRoutes(app) {
  const router = express.Router();
  router.use(CheckAccessToken);
  router.get("/", transactionController.FetchTransaction);
  router.post("/", transactionController.CreateTransaction);

  router.get("/calculate/summary/:targetLevel", transactionController.CalculateSummary);
  // router.post("/calculate/add-modal/:targetLevel", transactionController.CalculateProfit);
  app.use("/api/transaction", router);
}
