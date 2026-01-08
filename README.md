# WE_SELL - E-commerce Platform 2026

A modern, full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js). This platform features a comprehensive wallet system, user dashboard with analytics, secure authentication, and a responsive shopping experience.

## 🚀 Features

### User Features
- **Authentication**: Secure Login and Registration with JWT.
- **Shopping**: Browse products with advanced filtering (Category, Price, Search) and sorting.
- **Cart & Checkout**: Seamless cart management and order placement.
- **Wallet System**:
  - Add funds via simulated cards.
  - Transfer funds between saved cards.
  - Send money to other users via email.
  - View detailed transaction history.
  - Pay for orders using wallet balance.
- **User Dashboard**:
  - Visual spending analytics (Charts).
  - Order history tracking.
  - Profile management.
  - Data export functionality.
- **Dark Mode**: System-wide dark/light theme toggle.

### General
- **Responsive Design**: Optimized for mobile and desktop.
- **Informational Pages**: FAQ, Shipping, Returns, Privacy Policy, Terms of Service, Contact.

## 🛠️ Tech Stack

- **Frontend**: React.js, React Router DOM, Axios, Recharts, React Hot Toast.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Authentication**: JSON Web Tokens (JWT), bcryptjs.

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local or Atlas connection string)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Ecom-platform-2026
```

### 2. Backend Setup
Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
npm run dev
# or
npm start
```

### 3. Frontend Setup
Navigate to the client directory and install dependencies:
```bash
cd ../client
npm install
```

Start the React application:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173` (or your configured port), communicating with the backend at `http://localhost:5000`.

## 🛡️ License

This project is licensed under the MIT License.