import env from "#config/env_config";
import { RegisterRoutes } from "#routes/routes";
import express from "express"
// import { NewMiddliware } from "./middlewares/middleware.js";

export function createApp() {
  const app = express();
  app.use(express.json());
  RegisterRoutes(app);
  return app;
}

export function newServer() {
  const app = createApp();
  const host = env.app.appHost || 'localhost';
  const port = env.app.appPort || 3000;

  const server = app.listen(port, host, () => {
    console.log(`Server started on http://${host}:${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use.`);
    } else {
      console.error('Server error:', err);
    }
    process.exit(1);
  });

  return server;
}