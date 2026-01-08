import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import Skeleton from "../components/Skeleton";
import { useCart } from "../context/CartContext";

export default function History() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const { clearCart } = useCart();
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    console.error("Error parsing user data:", error);
  }

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const { data: responseData } = await axios.get(`http://localhost:5000/api/orders/my-orders?page=${page}&keyword=${keyword}&t=${new Date().getTime()}`, config); // Add timestamp to prevent caching
        setOrders(responseData.orders);
        setPage(responseData.page);
        setPages(responseData.pages);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(debounceFetch);
  }, [page, keyword]);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.put(`http://localhost:5000/api/orders/${orderId}/cancel`, {}, config);
        setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? { ...o, status: 'Cancelled' } : o));
        toast.success("Order cancelled successfully");
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast.error(error.response?.data?.message || "Failed to cancel order");
      }
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete(`http://localhost:5000/api/orders/${orderId}`, config);
        setOrders(prevOrders => prevOrders.filter(o => o._id !== orderId));
        toast.success("Order deleted successfully");
      } catch (error) {
        console.error("Error deleting order:", error);
        toast.error(error.response?.data?.message || "Failed to delete order");
      }
    }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.put(`http://localhost:5000/api/orders/${orderId}/pay`, {}, config);
      setOrders(prevOrders => prevOrders.map(o => o._id === orderId ? { ...o, isPaid: true, paidAt: new Date().toISOString() } : o));
      toast.success("Order marked as paid");
    } catch (error) {
      console.error("Error marking order as paid:", error);
      toast.error(error.response?.data?.message || "Failed to mark as paid");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("ARE YOU SURE? This will permanently delete your account, order history, and all saved data. This action cannot be undone.")) {
      try {
        const token = localStorage.getItem("token");
        const config = { headers: { Authorization: `Bearer ${token}` } };
        await axios.delete("http://localhost:5000/api/users/profile", config);
        
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        clearCart();
        toast.success("Account deleted successfully");
        navigate("/login");
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error(error.response?.data?.message || error.message || "Failed to delete account");
      }
    }
  };

  const generateInvoiceDoc = (order) => {
    // Helper function to generate PDF document object
      // 1. Initialize jsPDF
      if (!user) throw new Error("User information missing");
      const doc = new jsPDF();

      // 2. Add Logo and Company Details
      try {
        // This is a placeholder base64 logo. Replace with your own.
        const logo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACFSURBVGhD7c+xCQAgFEXRj9e9l9YUhJEgI/7vC84J4Jt5f4A/CRACJkAI+EIgQAiYACFghEAI+EIgQAiYACFghEAI+EIgQAiYACFghEAI+EIgQAiYACFghEAI+EIgQAiYACFghEAI+EIgQAiYACFghEAI+EIgQAiYACFgCg8AAQ9+g34GAAAAAElFTkSuQmCC';
        doc.addImage(logo, 'PNG', 14, 10, 30, 30);
      } catch (err) {
        console.warn("Failed to add logo to invoice", err);
      }

      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("We Sell Inc.", 195, 20, { align: "right" });
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("123 Ecom Street, Webville", 195, 26, { align: "right" });
      doc.text("contact@wesell.com", 195, 32, { align: "right" });

      // 3. Add Invoice Title and Billing Info
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      doc.text("INVOICE", 14, 45);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(`Invoice #: ${order._id}`, 14, 55);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 61);

      doc.setFont("helvetica", "bold");
      doc.text("Bill To:", 14, 75);
      doc.setFont("helvetica", "normal");
      doc.text(user?.name || "Customer", 14, 81);
      doc.text(order.shippingAddress?.address || "", 14, 87);
      doc.text(`${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}`, 14, 93);

      // 4. Create the table with custom styles
      autoTable(doc, {
        startY: 105,
        head: [['Item', 'Qty', 'Price', 'Total']],
        body: (order.orderItems || []).map(item => [item.name, item.qty, `₹${(item.price || 0).toFixed(2)}`, `₹${((item.price || 0) * (item.qty || 1)).toFixed(2)}`]),
        theme: 'striped',
        headStyles: {
          fillColor: [38, 50, 56], // Dark header background
          textColor: [255, 255, 255] // White header text
        },
        styles: {
          font: 'helvetica',
          fontSize: 10
        },
        didDrawPage: function (data) {
          // 5. Add a footer to each page
          doc.setFontSize(10);
          doc.text("Thank you for your business!", 14, doc.internal.pageSize.height - 10);
        }
      });

      // 6. Add Total and save the document
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 150;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Total: ₹${(order.totalPrice || 0).toFixed(2)}`, 195, finalY + 15, { align: "right" });
      
      return doc;
  };

  const downloadInvoice = (order) => {
    try {
      const doc = generateInvoiceDoc(order);
      doc.save(`invoice_${order._id}.pdf`);
    } catch (error) {
      console.error("Invoice generation error:", error);
      toast.error(`Failed to generate invoice: ${error.message}`);
    }
  };

  const handleDownloadAll = async () => {
    if (orders.length === 0) return toast.error("No orders to download");
    
    const zip = new JSZip();
    const toastId = toast.loading("Generating invoices...");

    try {
      orders.forEach((order) => {
        const doc = generateInvoiceDoc(order);
        const pdfBlob = doc.output("blob");
        zip.file(`invoice_${order._id}.pdf`, pdfBlob);
      });

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, "invoices.zip");
      toast.success("All invoices downloaded", { id: toastId });
    } catch (error) {
      console.error("Batch download error:", error);
      toast.error(`Failed to download invoices: ${error.message}`, { id: toastId });
    }
  };

  if (!user) return <div className="container"><h2>Please login to view history</h2></div>;

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1>Order History</h1>
        <div>
          {orders.length > 0 && (
            <button 
              onClick={handleDownloadAll} 
              style={{ marginRight: "10px", background: "#28a745", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" }}
            >
              Download All Invoices
            </button>
          )}
          <button 
            onClick={handleLogout} 
            style={{ marginRight: "10px", background: "#6c757d", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" }}
          >
            Logout
          </button>
          <button 
            onClick={handleDeleteAccount} 
            style={{ marginRight: "10px", background: "#dc3545", color: "white", border: "none", padding: "10px 15px", borderRadius: "5px", cursor: "pointer" }}
          >
            Delete Account
          </button>
          <Link to="/profile"><button>Back to Profile</button></Link>
        </div>
      </div>

      <div style={{ marginBottom: "1rem", display: "flex", gap: "1rem" }}>
        <input 
          type="text" 
          placeholder="Search orders by product name..." 
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(1);
          }}
          style={{ marginBottom: 0 }}
        />
      </div>

      {loading ? (
        <div style={{ display: "grid", gap: "1rem" }}>
          <Skeleton height="150px" />
          <Skeleton height="150px" />
          <Skeleton height="150px" />
        </div>
      ) : orders.length === 0 ? <p>No orders found.</p> : (
        <div style={{ display: "grid", gap: "1rem" }}>
          {orders.map(order => (
            <div key={order._id} className="product-card" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: "bold" }}>Order #{order._id.substring(0, 8)}</span>
                <span style={{ color: "#666" }}>{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div style={{ marginBottom: "1rem" }}>
                {order.orderItems.map(item => (
                  <div key={item._id} style={{ fontSize: "0.9rem", color: "#444" }}>
                    • {item.name} x {item.qty}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", borderTop: "1px solid #eee", paddingTop: "0.5rem", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", color: "var(--primary)" }}>Total: ₹{order.totalPrice}</span>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <button onClick={() => downloadInvoice(order)} style={{ padding: "5px 10px", fontSize: "0.8rem", background: "#6c757d" }}>Invoice ⬇</button>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", background: order.isPaid ? "#dcfce7" : "#fee2e2", color: order.isPaid ? "#166534" : "#991b1b", fontSize: "0.8rem" }}>{order.isPaid ? "Paid" : "Not Paid"}</span>
                  <span style={{ padding: "2px 8px", borderRadius: "4px", background: "#eee", fontSize: "0.8rem" }}>{order.status}</span>
                  {order.status === "Processing" && (
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      style={{ padding: "5px 10px", fontSize: "0.8rem", background: "#ef4444" }}
                    >
                      Cancel
                    </button>
                  )}
                  {!order.isPaid && (
                    <>
                      <button 
                        onClick={() => handleMarkPaid(order._id)}
                        style={{ padding: "5px 10px", fontSize: "0.8rem", background: "#3b82f6" }}
                      >
                        Mark Paid
                      </button>
                      <button 
                        onClick={() => handleDeleteOrder(order._id)}
                        style={{ padding: "5px 10px", fontSize: "0.8rem", background: "#6b7280" }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
          {pages > 1 && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1rem" }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ background: page === 1 ? "#ccc" : "var(--primary)" }}>Previous</button>
              <span style={{ alignSelf: "center" }}>Page {page} of {pages}</span>
              <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ background: page === pages ? "#ccc" : "var(--primary)" }}>Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}