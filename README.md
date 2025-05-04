```markdown
# 💳 Credit Loan Management System

A full-featured backend system for managing credit sales (loans), customer profiles, repayments, and overdue tracking, designed for small shopkeepers and vendors. Built with **Node.js**, **Express**, and **MongoDB**.

---

## 📁 Features

### 👤 Customer Management
- Add/Edit/Delete customer profiles
- Fields: `name`, `phone`, `address`, `trust score (0–10)`, `credit limit`

### 💳 Loan (Credit Sale) Management
- Create a credit transaction:
  - `customerId`, `item description`, `amount`, `issue date`, `due date`, `frequency (bi-weekly/monthly)`
  - Optional: `interest %`, `grace days`
- View all active loans
- Loan status: `pending`, `paid`, `overdue`

### 💰 Repayment Tracking
- Record repayments (`amount + date`)
- Auto-update balance
- Supports partial payments

### 📊 Loan Summary & Overdue Alerts
- `/api/loans/summary`: Total loaned, total collected, overdue amount
- `/api/loans/overdue`: Lists overdue loans
- Average repayment time (bonus)
- Auto-tag overdue loans based on current date

---

## 🧾 API Endpoints

### 🔐 Authentication (with JWT)
| Method | Endpoint           | Description             |
|--------|--------------------|-------------------------|
| POST   | `/api/auth/register` | Register new user     |
| POST   | `/api/auth/login`    | Login & get token     |

### 👤 Customers
| Method | Endpoint        | Description                |
|--------|------------------|----------------------------|
| GET    | `/api/customers`  | Get all customers         |
| POST   | `/api/customers`  | Add a new customer        |
| PUT    | `/api/customers/:id` | Update a customer     |
| DELETE | `/api/customers/:id` | Delete a customer     |

### 💳 Loans
| Method | Endpoint           | Description                  |
|--------|---------------------|------------------------------|
| POST   | `/api/loans`         | Create new loan             |
| POST   | `/api/loans/repayment` | Record repayment         |
| GET    | `/api/loans`         | View all loans              |
| GET    | `/api/loans/summary` | Loan summary (per user)     |
| GET    | `/api/loans/overdue` | View overdue loans          |

> ⚠️ All `/api/*` routes require an **Authorization header** with a valid JWT.

```

Authorization: Bearer <token>

```

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- Moment.js (for date comparisons)

---

## 🚀 Deployment on Render (Steps)

1. Push project to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **"New Web Service"**
4. Connect your GitHub and choose the repo
5. Set:
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
6. Add Environment Variables:
   - `PORT` → `10000` (or blank)
   - `MONGO_URI` → your MongoDB Atlas URI
   - `JWT_SECRET` → your secret
7. Deploy — you’ll get a public API like:
```

[https://your-app-name.onrender.com](https://your-app-name.onrender.com)

````

---

## 📬 Sample Loan Creation Payload (POST `/api/loans`)

```json
{
"customerId": "654f2c2f7f0d4b67891e07ab",
"amount": 5000,
"dueDate": "2025-06-10",
"description": "TV Purchase",
"frequency": "monthly"
}
````

---

## 🧪 Testing with Postman

* Register & Login to get JWT
* Use JWT in `Authorization` header as Bearer Token
* Test endpoints like:

  ```
  GET http://localhost:5000/api/loans
  POST http://localhost:5000/api/loans
  GET http://localhost:5000/api/loans/summary
  GET http://localhost:5000/api/loans/overdue
  ```

---

## 📌 Folder Structure

```
.
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── index.js
├── .env
├── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the MIT License.

```
