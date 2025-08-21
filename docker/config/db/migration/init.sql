DROP TABLE IF EXISTS transactions;

CREATE TABLE
  transactions (
    id SERIAL PRIMARY KEY,
    nominal NUMERIC(15, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('success', 'pending', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );