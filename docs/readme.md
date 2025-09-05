# POS-Prototype

**POS-Prototype** is a lightweight Point of Sale (POS) system built with Node.js and Express.js.  
The main goal is to provide only the essential features that businesses actually need, while keeping the system fast and easy to use.  
The project is designed primarily for **tablet mobile-based usage**.

# 🚀 Current Features

## 1. Authentication
- **Register** – Create a new user account.  
- **Login** – Authenticate user using email or username & password.  
- **Generate Token** – Refresh and generate new access & refresh tokens. The refresh token is required for accessing the API. This endpoint is intended to be called periodically (e.g., via a scheduler) so users remain logged in.  
  - **Access Token** – JWT, expires every **5 minutes**.  
  - **Refresh Token** – JWT, stored in Redis, expires in **1 day**.  

## 2. Transaction
- **Create Transaction** – Record a transaction in the database and process payment via a **payment gateway**.  
  - Currently supports **Stripe** (can be changed in the future).  
  - Supported payment methods:  
    - `payment_link`  
    - `card`  
    - `ach_direct_debit`  
    - `sepa_debit`  

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

## 📚 API Documentation
The API is documented using **Swagger (OpenAPI 3.1.1 or the latest version)**.  
Available endpoints:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/generate-token`
- `POST /api/transaction`

## 🛠️ Tech Stack
- **Backend**: Node.js + Express.js
- **Database**: PostgreSQL
- **Cache/Session**: Redis
- **Payment Gateway**: Stripe
- **Auth**: JWT

---

## 🏃 Run in Development Stage

Make sure you have **Docker**, **Make**, and **nodemon** installed.  

If **nodemon** is not installed, you can install it globally with the following command:

```bash
npm install -g nodemon
```

Once all requirements are installed, run the project using:

```bash
git clone https://github.com/AzzamSyakir/pos-prototype.git
cd pos-prototype
make up-dev
make start-node
```

This will:

- Clone the project to your local machine.
- Build and start all required services (PostgreSQL, Redis, etc.).
- Run the application in **development mode** at [http://localhost:8080](http://localhost:8080).
- Start the Node.js app with **nodemon**, enabling **live reload** so the app automatically restarts when code changes are detected.

To stop the development environment:

```bash
make down-dev
```

---

## 🏃 Run in Production Stage

The production setup is similar to development. Ensure **Docker** and **Make** are installed, then run:

```bash
# skip the first step if the repo is already cloned
git clone https://github.com/AzzamSyakir/pos-prototype.git
cd pos-prototype
make up-prod
```

This will:

- Build and start all required services (PostgreSQL, Redis, etc.).
- Run the application in **production mode** at [http://localhost:8080](http://localhost:8080).
- Containers use **persistent image**. Auto-reload is **not enabled**; any code changes require stopping the containers, removing the images, and rebuilding them.

To stop the production environment:

```bash
make down-prod
```

---

### ⚡ Key Differences Between Development and Production

| Feature                     | Development                      | Production                                  |
| --------------------------- | -------------------------------- | ------------------------------------------- |
| Container Storage           | Uses Docker volume (live reload) | Persistent containers                       |
| Auto-restart on code change | ✅ Yes                            | ❌ No                                        |
| Applying code changes       | Instant (via live reload)        | Requires rebuild (down + remove image + up) |

---

