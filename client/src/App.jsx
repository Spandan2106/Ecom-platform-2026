import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import Checkout from "./pages/Checkout";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Wishlist from "./pages/Wishlist";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Contact from "./pages/Contact";
import History from './pages/History.jsx';
import Clear from "./pages/Clear"; // Make sure the file name matches exactly
import UpdateProfile from "./pages/UpdateProfile";
import PaymentMethods from "./pages/PaymentMethods";
import WalletPay from "./pages/WalletPay";
import WalletHistory from "./pages/WalletHistory";
import Wallet from "./pages/Wallet";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import "./DarkMode.css";
import "./Logo.css";
import RecentlyViewedTracker from "./components/RecentlyViewedTracker";
import FAQ from './pages/FAQ';
import Returns from './pages/Returns';
import Privacy from './pages/Privacy';
import Shipping from './pages/Shipping';
import Terms from './pages/Terms';

export default function App() {
  return (
    <ThemeProvider>
      <CartProvider>
        <AuthProvider>
        <Toaster 
          position="top-center" 
          reverseOrder={false} 
          toastOptions={{
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              borderRadius: '8px',
              padding: '12px 16px',
              fontSize: '0.95rem',
              maxWidth: '400px',
            },
            success: {
              iconTheme: { primary: '#28a745', secondary: '#fff' },
              style: { borderLeft: '4px solid #28a745' },
            },
            error: {
              iconTheme: { primary: '#dc3545', secondary: '#fff' },
              style: { borderLeft: '4px solid #dc3545' },
            },
            loading: {
              style: { borderLeft: '4px solid #6366f1' },
            },
          }}
        />
        <BrowserRouter>
          <Navbar />
          <RecentlyViewedTracker />
          <ThemeToggle />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/clear" element={<Clear />} />
            <Route path="/update-profile" element={<ProtectedRoute><UpdateProfile /></ProtectedRoute>} />
            <Route path="/payment-methods" element={<ProtectedRoute><PaymentMethods /></ProtectedRoute>} />
            <Route path="/wallet-pay" element={<ProtectedRoute><WalletPay /></ProtectedRoute>} />
            <Route path="/wallet-history" element={<ProtectedRoute><WalletHistory /></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
            
            <Route path="/faq" element={<FAQ />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/terms" element={<Terms />} />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
        </AuthProvider>
      </CartProvider>
    </ThemeProvider>
  );
}
