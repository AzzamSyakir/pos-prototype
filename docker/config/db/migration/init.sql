DROP TABLE IF EXISTS transactions;

DROP TABLE IF EXISTS users;

CREATE TABLE
  users (
    id UUID PRIMARY KEY,
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
    status VARCHAR(20) CHECK (status IN ('success', 'pending', 'failed')),
    payment_method VARCHAR(20),
    user_id UUID NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
  );