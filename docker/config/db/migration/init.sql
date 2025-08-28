DROP TABLE IF EXISTS transactions;

CREATE TABLE
  transactions (
    id UUID PRIMARY KEY,
    amount NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('success', 'pending', 'failed')),
    payment_method VARCHAR(20),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );