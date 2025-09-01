DROP TABLE IF EXISTS transactions;

DROP TABLE IF EXISTS users;

CREATE TABLE
  transactions (
    id UUID PRIMARY KEY,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('success', 'pending', 'failed')),
    payment_method VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

CREATE TABLE
  users (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    phone_number VARCHAR NOT NULL,
    stripe_customer_id VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );