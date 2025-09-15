import dotenv from "dotenv";


if (process.env.NODE_ENV === "test") {
  dotenv.config({
    path: ".env.test",
    quiet: true,
  });
} else {
  dotenv.config({
    path: ".env",
    quiet: true,
  });
}


export class AppEnv {
  constructor(appHost, appPort, jwtSecret) {
    this.appHost = appHost;
    this.appPort = appPort;
    this.jwtSecret = jwtSecret
  }
}

export class RedisEnv {
  constructor(host, port, username, password) {
    this.host = host;
    this.port = port;
    this.user = username;
    this.password = password
  }
}
export class PaymentGatewayEnv {
  constructor(secretKey, publishableKey) {
    this.secretKey = secretKey;
    this.publishableKey = publishableKey;
  }
}

class DbEnv {
  constructor(dbHost, dbPort, dbUsername, dbPassword, dbDatabase) {
    this.host = dbHost;
    this.port = dbPort;
    this.user = dbUsername;
    this.password = dbPassword;
    this.database = dbDatabase;
  }
}

class EnvModule {
  constructor(appEnv, dbEnv, PaymentGatewayEnv, redisEnv) {
    this.app = appEnv;
    this.db = dbEnv;
    this.PaymentGateway = PaymentGatewayEnv;
    this.redisEnv = redisEnv
  }
}

function NewEnv() {
  const appEnv = new AppEnv(
    process.env.APP_HOST,
    process.env.APP_PORT,
    process.env.JWT_SECRET
  );
  const redisEnv = new RedisEnv(
    process.env.REDIS_HOST,
    process.env.REDIS_PORT,
    process.env.REDIS_USERNAME,
    process.env.REDIS_PASSWORD
  );
  const dbEnv = new DbEnv(
    process.env.DB_HOST,
    process.env.DB_PORT,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    process.env.DB_DATABASE,
  );
  const paymentGatewayEnv = new PaymentGatewayEnv(
    process.env.STRIPE_SECRET_KEY,
    process.env.STRIPE_PUBLISHABLE_KEY
  )

  return new EnvModule(appEnv, dbEnv, paymentGatewayEnv, redisEnv);
}
const env = NewEnv();

export default env;
