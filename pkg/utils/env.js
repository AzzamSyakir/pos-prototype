import dotenv from "dotenv";

dotenv.config({
  quiet: true
}
);

class AppEnv {
  constructor(appHost, appPort) {
    this.APP_HOST = appHost;
    this.APP_PORT = appPort;
  }
}

class DbEnv {
  constructor(dbUsername, dbPassword, dbPort, dbDatabase) {
    this.DB_USERNAME = dbUsername;
    this.DB_PASSWORD = dbPassword;
    this.DB_PORT = dbPort;
    this.DB_DATABASE = dbDatabase;
  }
}

class EnvModule {
  constructor(appEnv, dbEnv) {
    this.app = appEnv;
    this.db = dbEnv;
  }
}

function NewEnv() {
  const appEnv = new AppEnv(
    process.env.APP_HOST,
    process.env.APP_PORT,
  );

  const dbEnv = new DbEnv(
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    process.env.DB_PORT,
    process.env.DB_DATABASE,
  );

  return new EnvModule(appEnv, dbEnv);
}

const env = NewEnv();

export default env;
