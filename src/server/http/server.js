<<<<<<< Updated upstream
import env from "#config/env_config";
import { RegisterRoutes } from "#httpServer/routes/routes";
import express from "express"
=======
import { NewRoutes } from "./routes/routes.js";
>>>>>>> Stashed changes
// import { NewMiddliware } from "./middlewares/middleware.js";


export function newServer() {
<<<<<<< Updated upstream
  const app = express();
  const host = env.app.APP_HOST || "localhost";
  const port = env.app.APP_PORT || 3000;
  const router = express.Router();
  app.use(express.json());
  RegisterRoutes(app, router);
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
=======

  const app = express();
  const host = 'localhost'; // change to get from env
  const port = 8080; // change to get from env

  // NewMiddliware();
  NewRoutes(app);

  app.listen(port, () => {
    console.log(`running at ${host}:${port}`);
  });
>>>>>>> Stashed changes
}
