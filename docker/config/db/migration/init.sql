DROP TABLE IF EXISTS transactions;

DROP TABLE IF EXISTS users;

CREATE TABLE
  users (
    id UUID PRIMARY KEY NOT NULL,
    name VARCHAR,
    email VARCHAR,
    password VARCHAR NOT NULL,
    phone_number VARCHAR,
    stripe_customer_id VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

CREATE TABLE
  transactions (
    id UUID PRIMARY KEY,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20),
    payment_method VARCHAR(20),
    user_id UUID NOT NULL,
    stripe_payment_id VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );

CREATE TYPE capital_type AS ENUM ('day', 'week', 'month', 'year');

CREATE TABLE
  capitals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid (),
    user_id UUID NOT NULL,
    amount NUMERIC(15, 2) NOT NULL,
    type capital_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT now (),
    updated_at TIMESTAMP NOT NULL DEFAULT now (),
    CONSTRAINT fk_capitals_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );