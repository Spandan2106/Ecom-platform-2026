<div align="center">

# 🛍️ WE_SELL - E-commerce Platform 2026

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://www.mongodb.com/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()

A modern, full-stack e-commerce application built with the MERN stack. This platform features a comprehensive wallet system, interactive user dashboard with analytics, secure authentication, and a responsive shopping experience.

</div>

---

## 🚀 Features

### 🛒 User & Shopping Features
- **Authentication**: Secure login and registration powered by JSON Web Tokens (JWT) and bcryptjs.
- **Advanced Product Catalog**: Browse products with real-time category filtering, price sorting, and instant search.
- **Cart & Checkout**: Seamless cart management and order placement workflow.
- **Interactive Wallet System**:
  - Add funds via simulated credit/debit cards.
  - Transfer funds securely between saved cards.
  - Send money instantly to other users via email.
  - View full transaction history logs.
  - Pay for orders directly using your wallet balance.
- **User Dashboard & Analytics**:
  - Visual spending analytics (charts using Recharts).
  - Order history tracking and status updates.
  - Profile management and data export functionality.

### 🌐 General & Informational Pages
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop screens.
- **Support & Policies**: Dedicated views for FAQ, Shipping, Returns, Privacy Policy, Terms of Service, and Contact.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router DOM, Axios, Recharts, React Hot Toast, Lucide Icons
- **Backend**: Node.js, Express.js, REST APIs
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcryptjs

---

## 🗂️ Project Structure

```text
Ecom-platform-2026/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── pages/          # View pages (Dashboard, Cart, Shop, Wallet)
│   │   ├── App.jsx         # Main application routes
│   │   └── main.jsx        # Entry point
│   └── package.json
├── server/                 # Express backend application
│   ├── controllers/        # Business logic handlers
│   ├── models/             # Mongoose schemas (User, Product, Order, Wallet)
│   ├── routes/             # API endpoint definitions
│   ├── middleware/         # Auth & error handling middlewares
│   └── server.js           # App entry point
└── README.md
```
**🔌 API Endpoints Overview**
| Method | Endpoint | Description |
* | :管 | :--- | :--- |
* | POST | ```/api/auth/register``` | Register a new user |
* | POST | ```/api/auth/login``` | Authenticate user & return JWT |
* | GET | ```/api/products``` | Fetch all products with filter/search options |
* | GET | ```/api/wallet``` | Fetch current user wallet balance & history |
* | POST |``` /api/wallet/transfer``` | Transfer funds between users/cards |


## 📈 Performance Testing

Load tested the backend using Grafana k6 against the
```GET /api/products``` endpoint.

| VUs | p95 Latency | Failure Rate |
|-----|-------------|--------------|
| 50  | 0.97s       | 0%           |
| 75  | 1.52s       | 0%           |
| 150 | 2.97s       | 0%           |
| 250 | 4.88s       | 0%           |
| 500 | 8.46s       | 19.52%       |
| 5000| 19.53s      | 92.57%       |

Note: ***The test identified significant latency degradation at higher concurrency and connection failures beginning around 500 VUs.***

**⚙️ Getting Started Locally**
Prerequisites
Make sure you have Node.js and MongoDB installed on your system.

1. **Clone the Repository**
```Bash
git clone [https://github.com/Spandan2106/Ecom-platform-2026.git](https://github.com/Spandan2106/Ecom-platform-2026.git)
cd Ecom-platform-2026
```
2. **Setup the Backend**
```Bash
cd server
npm install
```
Create a ```.env``` file inside the ```server/``` directory and configure your environment variables:

```Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```
Start the server:

```Bash
npm run dev
```
3. **Setup the Frontend**
Open a new terminal tab and navigate to the client folder:

```Bash
cd client
npm install
npm run dev
```
**📜 License**
Distributed under the ```MIT License```. See ```LICENSE``` for more information.

