# POS-Prototype

**POS-Prototype** is a lightweight Point of Sale (POS) system built with Node.js and Express.js.  
The main goal is to provide only the essential features that businesses actually need, while keeping the system fast and easy to use.  
The project is designed primarily for **mobile-based usage**.

## 🚀 Current Features
1. **Authentication**
   - **Register** → create a new user account.
   - **Login** → authenticate user with email or username & password.
   - **Generate Access Token** → refresh the access token using a refresh token.
     - Access Token expires every **5 minutes**.
     - Refresh Token is also JWT-based and stored in Redis.

2. **Transaction**
   - **Create Transaction** → core feature to record a transaction into the database.  
     After storing, payment is processed via a **payment gateway** (currently Stripe, but can be changed in the future).

## 🔒 Authentication Flow
- **JWT** is used for both access and refresh tokens.
- **Access Token**:
  - Short-lived (expires in 5 minutes).
  - Required for accessing protected endpoints.
- **Refresh Token**:
  - Also JWT, stored in Redis.
  - Used to generate new access tokens without requiring the user to log in again.

## 📈 Roadmap
planned features for upcoming releases:
- **Machine Learning integration** for revenue insights and profit calculation (based on user’s cost input).
- **Sales reports** (daily, weekly, monthly).
- **Product & stock management**.


## 📚 API Documentation
The API is documented using **Swagger (OpenAPI 3.1.0)**.  
Available endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/generate-access-token`
- `POST /api/transaction`

## 🛠️ Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Cache/Session**: Redis
- **Payment Gateway**: Stripe
- **Auth**: JWT

---

Ya bener, lebih jelas kalau step **clone repo → cd → run** ditulis sekalian.
Kalau gitu bagian **Run Locally** bisa jadi gini:

---

## 🏃 Run Locally

Make sure you have **Docker** and **Make** installed.
Then simply run:

```bash
git clone https://github.com/AzzamSyakir/pos-prototype.git
cd pos-prototype
make up-dev
```

This will:

* Build and start all required services (API server, PostgreSQL, Redis, etc.).
* Run the app in development mode on [http://localhost:8080](http://localhost:8080).
* Auto-restart services if the code changes.

To stop the progran:

```bash
make down-dev 
```

---

