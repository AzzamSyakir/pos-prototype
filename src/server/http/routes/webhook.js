import * as webhookController from "#controller/http/webhook";
import express from "express";
/**
 * @param {import('express').Express} app
 */
export function WebhookRoutes(app) {
  const router = express.Router();
  router.post("/update-transaction/status", (req, res) => {
    webhookController.UpdateTransactionStatus(req, res)
  });

  app.use("/webhook", router);
}
