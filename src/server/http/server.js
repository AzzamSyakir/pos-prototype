import env from "#utils/env";
import { NewRoutes } from "#httpServer/routes/routes";
import express from "express"
// import { NewMiddliware } from "./middlewares/middleware.js";


export function newServer() {

  const app = express();
  const host = env.app.APP_HOST;
  const port = env.app.APP_PORT

  // NewMiddliware();
  NewRoutes(app);

  app.listen(port, () => {
    console.log(`App Running at ${host}:${port}`);
  });
}