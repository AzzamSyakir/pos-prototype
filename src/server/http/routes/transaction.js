import * as transactionController from "#controller/http/transaction";
import express from "express";

/**
 * @param {import('express').Express} app
 */
export function TransactionRoutes(app) {
  const router = express.Router();
  router.get("/", (req, res) => {
    res.send("GET all transactions");
  });

  router.post("/", (req, res) => {
    transactionController.CreateTransaction(req, res)
  });

  app.use("/api/transaction", router);
}
