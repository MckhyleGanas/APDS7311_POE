import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CustomerHome() {
  const [transactionData, setTransactionData] = useState({
    sendername: "",
    bankname: "",
    branchcode: "",
    accountnumber: "",
    swiftcode: "",
    amount: "",
    currency: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the JWT token is available in localStorage
    const token = localStorage.getItem("jwtt");
    if (!token) {
      // Redirect to the login page if not logged in
      navigate("/customerlogin");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("jwtt"); // Remove JWT from localStorage
    navigate("/customerlogin");
  };

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setTransactionData({
      ...transactionData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("jwtt");
    if (!token) {
      alert("Please log in to create a transaction.");
      navigate("/customerlogin");
      return;
    }

    try {
      const response = await fetch("https://localhost:3001/bank/transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to create transaction.");
      }

      alert("Transaction created successfully!");
      setTransactionData({
        sendername: "",
        bankname: "",
        branchcode: "",
        accountnumber: "",
        swiftcode: "",
        amount: "",
        currency: "",
      });
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert(error.message);
    }
  };

  return (
    <div>
      <h2>Create a New Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipient</label>
          <input
            type="text"
            name="sendername"
            className="form-control"
            value={transactionData.sendername}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Bank Name</label>
          <input
            type="text"
            name="bankname"
            className="form-control"
            value={transactionData.bankname}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Branch Code</label>
          <input
            type="text"
            name="branchcode"
            className="form-control"
            value={transactionData.branchcode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            name="accountnumber"
            className="form-control"
            value={transactionData.accountnumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>SWIFT Code</label>
          <input
            type="text"
            name="swiftcode"
            className="form-control"
            value={transactionData.swiftcode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            value={transactionData.amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Currency</label>
          <input
            type="text"
            name="currency"
            className="form-control"
            value={transactionData.currency}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Submit Transaction
        </button>
      </form>
      <button
        className="btn btn-danger"
        onClick={handleLogout}
        style={{ marginLeft: "20px" }}
      >
        Logout
      </button>
    </div>
  );
}
