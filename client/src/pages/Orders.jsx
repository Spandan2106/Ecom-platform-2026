import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  
  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get(`${API_URL}/api/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setOrders(res.data));
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      {orders.map(order => (
        <div key={order._id}>
          <p>Total: ₹{order.totalAmount}</p>
          <p>Status: {order.status}</p>
        </div>
      ))}
    </div>
  );
}
