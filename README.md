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
