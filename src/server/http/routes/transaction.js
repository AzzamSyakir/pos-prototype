import * as transactionController from "#controller/http/transaction";

/**
 * @param {import('express').Express} app
 * @param {import('express').Router} router
 */
export function TransactionRoutes(app, router) {
  router.get("/", (req, res) => {
    res.send("GET all transactions");
  });

  router.post("/", (req, res) => {
    transactionController.CreateTransaction(req, res)
  });

  app.use("/api/transaction", router);
}
