import env from "#config/env_config";
import { RegisterRoutes } from "#httpServer/routes/routes";
import express from "express"
// import { NewMiddliware } from "./middlewares/middleware.js";


export function newServer() {
  const app = express();
  const host = env.app.appHost || "localhost";
  const port = env.app.appPort || 3000;
  app.use(express.json());
  RegisterRoutes(app);
  app.set("port", port);
  const server = app.listen(app.get("port"), host, () => {
    console.log(`Server started on http://${host}:${app.get("port")}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });
  return app;
}
