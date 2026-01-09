import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function WalletHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalSpent, setTotalSpent] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, address, total } = location.state || {};

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = { headers: { Authorization: `Bearer ${token}` } };
        
        // Fetch orders with pagination and filter by payment method
        let url = `${API_URL}/api/orders/my-orders?page=${page}&paymentMethod=We Sell Pay Balance`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
        const { data } = await axios.get(url, config);
        
        setTransactions(data.orders);
        setPage(data.page);
        setPages(data.pages);
        setTotalSpent(data.totalSpent);
      } catch (error) {
        console.error("Error fetching wallet history:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [page, startDate, endDate]);

  const handlePrintReceipt = (order) => {
    const receiptWindow = window.open('', '', 'width=600,height=600');
    receiptWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .details { margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-weight: bold; text-align: right; margin-top: 10px; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>We Sell Pay Receipt</h2>
            <p>Transaction ID: ${order.paymentResult?.id || "N/A"}</p>
            <p>Date: ${new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div class="details">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <h3>Items:</h3>
            ${order.orderItems.map(item => `
              <div class="item">
                <span>${item.name} (x${item.qty})</span>
                <span>₹${item.price * item.qty}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            Total Amount: ₹${order.totalPrice}
          </div>
        </body>
      </html>
    `);
    receiptWindow.document.close();
    receiptWindow.print();
  };

  const handleExportCSV = () => {
    if (transactions.length === 0) return alert("No transactions to export.");

    const headers = ["Transaction ID", "Date", "Order ID", "Items", "Total Amount", "Status"];
    const rows = transactions.map(order => [
      order.paymentResult?.id || "N/A",
      new Date(order.createdAt).toLocaleDateString(),
      order._id,
      `"${order.orderItems.map(i => `${i.name.replace(/"/g, '""')} (x${i.qty})`).join("; ")}"`,
      order.totalPrice,
      "Success"
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "wallet_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container" style={{ marginTop: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Wallet Transaction History</h1>
        <div>
          <button onClick={handleExportCSV} style={{ marginRight: "10px", background: "#28a745", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" }}>Export CSV</button>
          <button onClick={() => {
            if (items) {
              navigate("/wallet-pay", { state: { items, address, total } });
            } else {
              navigate("/wallet");
            }
          }}>Back to Wallet</button>
        </div>
      </div>

      <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px", marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
        <span style={{ fontWeight: "bold" }}>Filter by Date:</span>
        <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        <span>to</span>
        <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
        {(startDate || endDate) && (
          <button onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }} style={{ padding: "8px 12px", background: "#6c757d", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Clear Filter</button>
        )}
      </div>

      <div style={{ marginBottom: "1.5rem", padding: "15px", background: "#e0f2fe", borderRadius: "8px", border: "1px solid #bae6fd", color: "#0369a1" }}>
        <h3 style={{ margin: 0 }}>Total Spent: ₹{totalSpent}</h3>
        {(startDate || endDate) && <small>For the selected date range</small>}
      </div>

      {loading ? <p>Loading transactions...</p> : transactions.length === 0 ? <p>No wallet transactions found.</p> : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {transactions.map(order => (
            <div key={order._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", background: "white" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontWeight: "bold" }}>Transaction ID: {order.paymentResult?.id || "N/A"}</span>
                <span style={{ color: "#666" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ margin: "0 0 5px 0" }}><strong>Order ID:</strong> {order._id}</p>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "#555" }}>
                    Items: {order.orderItems.map(i => i.name).join(", ")}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <h3 style={{ margin: "0 0 5px 0", color: "#dc3545" }}>- ₹{order.totalPrice}</h3>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "5px" }}>
                    <span style={{ background: "#dcfce7", color: "#166534", padding: "2px 8px", borderRadius: "4px", fontSize: "0.8rem" }}>Success</span>
                    <button onClick={() => handlePrintReceipt(order)} style={{ padding: "4px 8px", fontSize: "0.8rem", cursor: "pointer", background: "#007bff", color: "white", border: "none", borderRadius: "4px" }}>Download Receipt</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: page === 1 ? "#ccc" : "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: page === 1 ? "default" : "pointer" }}>Previous</button>
              <span style={{ alignSelf: "center" }}>Page {page} of {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ background: page === pages ? "#ccc" : "#007bff", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", cursor: page === pages ? "default" : "pointer" }}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}