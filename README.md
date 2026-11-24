# Online_Banking_And_Fund_Transfer_System

A full-stack banking demo with Spring Boot backend and React/Vite frontend.

## Overview

- Backend: Java 21, Spring Boot 3.3.3, JWT authentication, H2 in-memory database, OpenAPI / Swagger.
- Frontend: React 18, Vite 5, Bootstrap 5, Axios, protected routes.

## Verified End-to-End Flows

- User registration and login
- Account deposit
- Account withdrawal
- Beneficiary creation
- Transfer restriction enforcement (24-hour cooling period)
- Transaction history retrieval
- OpenAPI documentation retrieval

## Run Locally

### Backend

1. Open a terminal and run:

```sh
cd backend
mvnw spring-boot:run
```

2. Confirm backend is running on `http://localhost:8080`.

### Frontend

1. Open a separate terminal and run:

```sh
cd frontend
npm install
npm run dev
```

2. Open the app at `http://localhost:5173`.

## Usage Guide

### 1. Start the backend

1. Open a terminal.
2. Run:

```sh
cd backend
mvnw spring-boot:run
```

3. Confirm the backend is running at `http://localhost:8080`.

### 2. Start the frontend

1. Open a separate terminal.
2. Run:

```sh
cd frontend
npm install
npm run dev
```

3. Open the app at `http://localhost:5173`.

### 3. Test user registration and login

1. Open the frontend in your browser.
2. Use the Register page to create a new account with name, email, password, and phone.
3. After registration, log in using the same email and password.
4. Successful login should redirect to the dashboard and store your JWT session.

### 4. Perform deposit and withdraw

- Deposit:
  1. Open the Deposit page.
  2. Enter an amount and submit.
  3. The balance updates after a successful deposit.

- Withdraw:
  1. Open the Withdraw page.
  2. Enter an amount and submit.
  3. The balance updates after a successful withdrawal.

### 5. Add a beneficiary

1. Open the Beneficiaries page.
2. Enter beneficiary details:
   - Beneficiary name
   - Beneficiary account number
   - Bank name
   - IFSC code
3. Save the beneficiary.
4. The new beneficiary appears in your beneficiary list.

### 6. 24-hour beneficiary cooling period

- After adding a beneficiary, you must wait 24 hours before transferring funds to that beneficiary.
- During this cooling period, transfer attempts fail with the message: `Beneficiary cooling period not completed`.
- This is a built-in safety restriction for new beneficiary transfers.

### 7. Perform a fund transfer after the cooling period

1. Wait 24 hours after adding the beneficiary.
2. Open the Transfer page.
3. Select the beneficiary from the dropdown.
4. Enter the transfer amount and optional remarks.
5. Submit the transfer.
6. If the beneficiary cooling period has passed and the account has sufficient balance, the transfer succeeds.

### 8. View transaction history

1. Open the Transactions page.
2. Your account transaction history is displayed.
3. You can also view recent transactions on the Dashboard page.

### 9. Troubleshooting tips

- If the frontend does not load, confirm the backend is running at `http://localhost:8080`.
- If login fails, verify your email and password and ensure the backend JWT endpoints are reachable.
- If deposit or withdrawal actions fail, check the backend logs for validation errors and ensure the account has enough balance.
- If transfer fails with the cooling period error, wait 24 hours after beneficiary creation before retrying.
- Because the app uses an in-memory H2 database, restarting the backend clears user and transaction data.

## API Documentation

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/api-docs`
- Saved spec: `api-docs.json`

## Postman Collection

Import `postman_collection.json` into Postman.

### Environment Variables

- `base_url`: `http://localhost:8080/api`
- `token`: JWT returned from `/auth/login`
- `accountId`: numeric account ID returned from login
- `accountNumber`: account number returned from login

## Important Notes

- The application uses an in-memory H2 database, so data is reset on each backend restart.
- Transfers require a registered beneficiary and are subject to a 24-hour cooling period after beneficiary creation.

## Key API Endpoints

- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — authenticate and receive JWT
- `GET /api/account/{accountId}/balance` — retrieve account balance
- `POST /api/account/deposit` — deposit funds
- `POST /api/account/withdraw` — withdraw funds
- `POST /api/beneficiaries` — add a new beneficiary
- `GET /api/beneficiaries?accountId={accountId}` — list beneficiaries
- `POST /api/transfer` — transfer funds through a registered beneficiary
- `GET /api/transactions/account/{accountId}` — get transaction history for account
