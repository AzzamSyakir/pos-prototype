/**
 * @param {import('express').Express} app
 * @param {import('express').Router} router
 */
export function TransactionRoutes(app, router) {
  router.get("/", (req, res) => {
    res.send("GET all transactions");
  });

  router.post("/", (req, res) => {
    res.send("CREATE new transaction");
  });

  app.use("/api/transaction", router);
}
