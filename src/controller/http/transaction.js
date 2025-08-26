import * as transactionServices from "#services/transaction";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export function CreateTransaction(req, res) {
  transactionServices.CreateTransaction(req.body.amount)
  return res.json({ message: "Transaction created" });
}
