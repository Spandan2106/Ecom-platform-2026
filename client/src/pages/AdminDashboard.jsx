import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "", price: "", category: "", description: "", imageUrl: "", stock: ""
  });

  const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === "products") {
        const res = await axios.get(`${API_URL}/api/products`);
        setProducts(res.data);
      } else {
        const res = await axios.get(`${API_URL}/api/admin/orders`, config);
        setOrders(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/admin/products`, newProduct, config);
      alert("Product added!");
      setNewProduct({ name: "", price: "", category: "", description: "", imageUrl: "", stock: "" });
      fetchData();
    } catch (err) {
      alert("Error adding product");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await axios.delete(`${API_URL}/api/admin/products/${id}`, config);
        fetchData();
      } catch (err) {
        alert("Error deleting product");
      }
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/orders/${id}`, { status }, config);
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div style={{ marginBottom: "2rem" }}>
        <button onClick={() => setActiveTab("products")} style={{ marginRight: "1rem", background: activeTab === "products" ? "var(--primary)" : "#ccc" }}>Products</button>
        <button onClick={() => setActiveTab("orders")} style={{ background: activeTab === "orders" ? "var(--primary)" : "#ccc" }}>Orders</button>
      </div>

      {activeTab === "products" ? (
        <div>
          <div className="form-container" style={{ margin: "0 0 2rem 0", maxWidth: "100%" }}>
            <h3>Add New Product</h3>
            <form onSubmit={handleAddProduct} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <input placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
              <input placeholder="Price" type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
              <input placeholder="Category" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} required />
              <input placeholder="Stock" type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
              <input placeholder="Image URL" value={newProduct.imageUrl} onChange={e => setNewProduct({...newProduct, imageUrl: e.target.value})} style={{ gridColumn: "span 2" }} />
              <textarea 
                placeholder="Description" 
                value={newProduct.description} 
                onChange={e => setNewProduct({...newProduct, description: e.target.value})} 
                style={{ gridColumn: "span 2", padding: "10px", width: "100%", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              <button type="submit" style={{ gridColumn: "span 2" }}>Add Product</button>
            </form>
          </div>

          <div className="product-grid">
            {products.map(p => (
              <div key={p._id} className="product-card">
                <h4>{p.name}</h4>
                <p>₹{p.price}</p>
                <button onClick={() => handleDeleteProduct(p._id)} style={{ background: "#ef4444" }}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} style={{ background: "white", padding: "1rem", marginBottom: "1rem", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <h3>Order #{order._id.substring(0, 8)}</h3>
                <span style={{ fontWeight: "bold", color: "var(--primary)" }}>{order.status}</span>
              </div>
              <p>User: {order.user?.name} ({order.user?.email})</p>
              <p>Total: ₹{order.totalPrice}</p>
              <div style={{ margin: "1rem 0" }}>
                {order.orderItems.map(item => (
                  <div key={item._id} style={{ fontSize: "0.9rem", color: "#666" }}>
                    {item.name} x {item.qty}
                  </div>
                ))}
              </div>
              <div>
                <select 
                  value={order.status} 
                  onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                  style={{ padding: "5px", marginRight: "10px" }}
                >
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}