import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Wallet.css";

export default function Wallet() {
  const { user, updateUser, notify, loading, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser(); // Force refresh wallet data on mount
  }, []);

  const [processing, setProcessing] = useState(false);
  const [showAddMoneyModal, setShowAddMoneyModal] = useState(false);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [amount, setAmount] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [saveCard, setSaveCard] = useState(false);
  const [selectedCard, setSelectedCard] = useState("new");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [showDeleteCardModal, setShowDeleteCardModal] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [showEditCardModal, setShowEditCardModal] = useState(false);
  const [cardToEdit, setCardToEdit] = useState(null);
  const [newExpiry, setNewExpiry] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [newLimit, setNewLimit] = useState("");
  const [showTransferCardModal, setShowTransferCardModal] = useState(false);
  const [sourceCard, setSourceCard] = useState("");
  const [destCard, setDestCard] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const handleAddMoney = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return notify("Please enter a valid amount", "error");
    setProcessing(true);
    
    if (selectedCard === "new") {
      if (!/^\d{16}$/.test(cardDetails.number)) return notify("Card number must be exactly 16 digits", "error");
      if (!cardDetails.expiry || !cardDetails.cvv) return notify("Please fill all card details", "error");
    }

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      let description = "";
      if (selectedCard === "new") {
        description = `Added funds via Card ending in ${cardDetails.number ? cardDetails.number.slice(-4) : 'XXXX'}`;
      } else {
        const card = user.savedCards?.find(c => c._id === selectedCard);
        if (!card) {
          notify("Selected card not found", "error");
          return;
        }
        description = `Added funds via Saved ${card.brand || "Card"} ending in ${card.last4}`;
      }

      const { data } = await axios.post("http://localhost:5000/api/users/wallet/add", {
        amount: Number(amount),
        description,
        cardDetails: selectedCard === "new" ? cardDetails : null,
        saveCard: selectedCard === "new" ? saveCard : false,
        cardId: selectedCard !== "new" ? selectedCard : null
      }, config);

      updateUser(data);
      await fetchUser(); // Double-check sync with server
      notify("Funds added successfully!");
      setShowAddMoneyModal(false);
      setAmount("");
      setCardDetails({ number: "", expiry: "", cvv: "" });
      setSaveCard(false);
      setSelectedCard("new");
    } catch (error) {
      console.error("Error adding funds:", error);
      notify(error.response?.data?.message || "Failed to add funds. Please check your connection.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteCard = (cardId) => {
    setCardToDelete(cardId);
    setShowDeleteCardModal(true);
  };

  const confirmDeleteCard = async () => {
    if (!cardToDelete) return;
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.delete(`http://localhost:5000/api/users/wallet/cards/${cardToDelete}`, config);
      updateUser(data);
      if (selectedCard === cardToDelete) {
        setSelectedCard("new");
      }
      notify("Card removed successfully");
      setShowDeleteCardModal(false);
      setCardToDelete(null);
    } catch (error) {
      console.error("Error deleting card:", error);
      notify(error.response?.data?.message || "Failed to delete card. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleEditCard = (card) => {
    setCardToEdit(card);
    setNewExpiry(card.expiry || "");
    setShowEditCardModal(true);
  };

  const confirmEditCard = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put(`http://localhost:5000/api/users/wallet/cards/${cardToEdit._id}`, { expiry: newExpiry }, config);
      updateUser(data);
      await fetchUser();
      notify("Card updated successfully");
      setShowEditCardModal(false);
    } catch (error) {
      notify(error.response?.data?.message || "Failed to update card. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleSendMoney = async (e) => {
    e.preventDefault();
    if (!sendAmount || sendAmount <= 0) return notify("Please enter a valid amount", "error");
    if (!recipientEmail) return notify("Please enter recipient email", "error");
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post("http://localhost:5000/api/users/wallet/send", {
        email: recipientEmail,
        amount: Number(sendAmount)
      }, config);

      updateUser(data);
      await fetchUser();
      notify(`Sent ₹${sendAmount} to ${recipientEmail}`);
      setShowSendMoneyModal(false);
      setSendAmount("");
      setRecipientEmail("");
    } catch (error) {
      console.error("Error sending money:", error);
      notify(error.response?.data?.message || "Failed to send money. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateLimit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.put("http://localhost:5000/api/users/wallet/limit", { limit: newLimit }, config);
      updateUser(data);
      await fetchUser();
      notify("Transaction limit updated");
      setShowLimitModal(false);
    } catch (error) {
      notify(error.response?.data?.message || "Failed to update limit. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleCardTransfer = async (e) => {
    e.preventDefault();
    if (sourceCard === destCard) return notify("Source and Destination cards must be different", "error");
    if (!transferAmount || transferAmount <= 0) return notify("Invalid amount", "error");
    setProcessing(true);

    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.post("http://localhost:5000/api/users/wallet/transfer-card", {
        sourceCardId: sourceCard,
        destCardId: destCard,
        amount: Number(transferAmount)
      }, config);
      
      // Update local user data with new card balances
      updateUser(data);
      await fetchUser();
      notify("Transfer successful");
      setShowTransferCardModal(false);
      setTransferAmount("");
    } catch (error) {
      notify(error.response?.data?.message || "Transfer failed. Please try again.", "error");
    } finally {
      setProcessing(false);
    }
  };

  if (loading && !user) return <div className="container"><h2>Loading Wallet...</h2></div>;
  if (!user) {
    const token = localStorage.getItem("token");
    if (token) {
      return (
        <div className="container error-message">
          <h2>Unable to load wallet data.</h2>
          <p>We couldn't fetch your latest wallet details.</p>
          <div className="error-actions">
            <button onClick={() => window.location.reload()} className="error-btn">Retry</button>
            <button onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }} className="error-btn logout">Logout</button>
          </div>
        </div>
      );
    }
    return <div className="container"><h2>Please login to view wallet</h2></div>;
  }

  return (
    <div className="container">
      <h1>My Wallet</h1>
      <div className="wallet-balance-card">
        <h2>Current Balance</h2>
        <div className="wallet-balance-display">₹{user.walletBalance?.toFixed(2) || "0.00"}</div>
        <div className="wallet-actions">
          <button onClick={() => setShowAddMoneyModal(true)} className="wallet-action-btn">
            + Add Funds
          </button>
          <button onClick={() => setShowSendMoneyModal(true)} className="wallet-action-btn secondary">
            ↗ Send Money
          </button>
          <button onClick={() => setShowTransferCardModal(true)} className="wallet-action-btn secondary">
            ↔ Card Transfer
          </button>
        </div>
        <div className="wallet-limit-info">
          Transaction Limit: ₹{user.transactionLimit || 10000}
          <button onClick={() => { setNewLimit(user.transactionLimit || 10000); setShowLimitModal(true); }} className="wallet-limit-edit">
            Edit
          </button>
        </div>
      </div>

      {/* Saved Cards Section */}
      <div className="saved-cards-section">
        <h3>Saved Cards</h3>
        {(!user.savedCards || user.savedCards.length === 0) ? (
          <p style={{ color: "#666" }}>No saved cards.</p>
        ) : (
          <div className="saved-cards-grid">
            {user.savedCards.map((card) => (
              <div key={card._id} className="saved-card">
                <div className="saved-card-info">
                  <div className="saved-card-brand">{card.brand || "Card"}</div>
                  <div className="saved-card-last4">**** {card.last4}</div>
                  <div className="saved-card-expiry">Exp: {card.expiry || "N/A"}</div>
                  <div className="saved-card-balance">Bal: ₹{card.balance || 0}</div>
                </div>
                <div className="saved-card-actions">
                  <button onClick={() => handleEditCard(card)} className="saved-card-btn">Edit</button>
                  <button onClick={() => handleDeleteCard(card._id)} className="saved-card-btn danger">Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="transaction-history-header">
        <h3>Transaction History</h3>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="transaction-filter"
        >
          <option value="all">All Transactions</option>
          <option value="credit">Credits (+)</option>
          <option value="debit">Debits (-)</option>
        </select>
      </div>

      {(!user.walletHistory || user.walletHistory.length === 0) ? ( 
        <p>No transactions yet.</p>
      ) : (
        <div className="transaction-list">
          {[...user.walletHistory].reverse()
            .filter(t => filterType === "all" ? true : t.type === filterType)
            .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
            .map((transaction, index) => (
            <div key={index} className="transaction-item">
              <div className="transaction-info">
                <div className="transaction-description">{transaction.description}</div>
                <div className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</div>
              </div>
              <div className={`transaction-amount ${transaction.type}`}>
                {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
              </div>
            </div>
          ))}
          
          {/* Pagination Controls */}
          {user.walletHistory.length > itemsPerPage && (
            <div className="pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span className="pagination-page">Page {currentPage}</span>
              <button
                onClick={() => setCurrentPage(p => (p * itemsPerPage < user.walletHistory.filter(t => filterType === "all" ? true : t.type === filterType).length) ? p + 1 : p)}
                disabled={currentPage * itemsPerPage >= user.walletHistory.filter(t => filterType === "all" ? true : t.type === filterType).length}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
      
      <div className="back-to-profile">
        <Link to="/profile"><button className="back-btn">Back to Profile</button></Link>
      </div>

      {showAddMoneyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Add Funds</h2>
            <form onSubmit={handleAddMoney}>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="form-input" required />
              </div>

              {user.savedCards && user.savedCards.length > 0 && (
                <div className="form-group">
                  <label className="form-label">Select Card</label>
                  <select value={selectedCard} onChange={(e) => setSelectedCard(e.target.value)} className="form-input">
                    <option value="new">Use New Card</option>
                    {user.savedCards.map(card => (
                      <option key={card._id} value={card._id}>{card.brand || "Card"} ending in {card.last4}</option>
                    ))}
                  </select>
                </div>
              )}

              {selectedCard === "new" && (
                <>
                  <div className="form-group">
                    <label className="form-label">Card Number</label>
                    <input type="text" maxLength="16" placeholder="1234 5678 1234 5678" value={cardDetails.number} onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})} className="form-input" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Expiry</label>
                      <input type="text" placeholder="MM/YY" value={cardDetails.expiry} onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})} className="form-input" required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">CVV</label>
                      <input type="password" maxLength="3" placeholder="123" value={cardDetails.cvv} onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})} className="form-input" required />
                    </div>
                  </div>
                  <div className="checkbox-group">
                    <input type="checkbox" id="saveCard" checked={saveCard} onChange={(e) => setSaveCard(e.target.checked)} />
                    <label htmlFor="saveCard">Save this card for future use</label>
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddMoneyModal(false)} className="modal-btn cancel">Cancel</button>
                <button type="submit" disabled={processing} className="modal-btn primary">{processing ? "Processing..." : "Add Money"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSendMoneyModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Send Money</h2>
            <form onSubmit={handleSendMoney}>
              <div className="form-group">
                <label className="form-label">Recipient Email</label>
                <input type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} className="form-input" required placeholder="user@example.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="form-input" required />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowSendMoneyModal(false)} className="modal-btn cancel">Cancel</button>
                <button type="submit" disabled={processing} className="modal-btn primary">{processing ? "Sending..." : "Send"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteCardModal && (
        <div className="modal-overlay">
          <div className="modal-content delete-modal">
            <h3 className="modal-title danger">Remove Card?</h3>
            <p className="modal-description">Are you sure you want to remove this saved card? This action cannot be undone.</p>
            <div className="modal-actions centered">
              <button onClick={() => setShowDeleteCardModal(false)} className="modal-btn cancel">Cancel</button>
              <button onClick={confirmDeleteCard} disabled={processing} className="modal-btn danger">{processing ? "Removing..." : "Remove"}</button>
            </div>
          </div>
        </div>
      )}

      {showEditCardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Edit Card Expiry</h3>
            <form onSubmit={confirmEditCard}>
              <div className="form-group">
                <label className="form-label">New Expiry (MM/YY)</label>
                <input type="text" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} className="form-input" required />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditCardModal(false)} className="modal-btn cancel">Cancel</button>
                <button type="submit" disabled={processing} className="modal-btn success">{processing ? "Updating..." : "Update"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showLimitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Set Transaction Limit</h3>
            <form onSubmit={handleUpdateLimit}>
              <div className="form-group">
                <label className="form-label">Limit Amount (₹)</label>
                <input type="number" value={newLimit} onChange={(e) => setNewLimit(e.target.value)} className="form-input" required />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowLimitModal(false)} className="modal-btn cancel">Cancel</button>
                <button type="submit" disabled={processing} className="modal-btn success">{processing ? "Updating..." : "Update"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTransferCardModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Transfer Between Cards</h3>
            <form onSubmit={handleCardTransfer}>
              <div className="form-group">
                <label className="form-label">Source Card</label>
                <select value={sourceCard} onChange={(e) => setSourceCard(e.target.value)} className="form-input" required>
                  <option value="">Select Source</option>
                  {user.savedCards?.map(card => <option key={card._id} value={card._id}>{card.brand} (**{card.last4}) - ₹{card.balance}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Destination Card</label>
                <select value={destCard} onChange={(e) => setDestCard(e.target.value)} className="form-input" required>
                  <option value="">Select Destination</option>
                  {user.savedCards?.filter(c => c._id !== sourceCard).map(card => <option key={card._id} value={card._id}>{card.brand} (**{card.last4}) - ₹{card.balance}</option>)}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹)</label>
                <input type="number" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} className="form-input" required />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowTransferCardModal(false)} className="modal-btn cancel">Cancel</button>
                <button type="submit" disabled={processing} className="modal-btn success">{processing ? "Transferring..." : "Transfer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
