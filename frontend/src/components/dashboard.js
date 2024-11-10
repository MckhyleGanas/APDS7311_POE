import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Transaction = (props) => (
  <tr>
    <td>{props.post.sendername}</td>
    <td>{props.post.bankname}</td>
    <td>{props.post.branchcode}</td>
    <td>{props.post.accountnumber}</td>
    <td>{props.post.swiftcode}</td>
    <td>{props.post.amount}</td>
    <td>{props.post.currency}</td>
    <td>{props.post.provider}</td>
    {props.post.verified ? (
      <td>Verified</td>
    ) : (
      <td>
        <button
          className="btn btn-link"
          onClick={() => props.verifyTransaction(props.post._id)}
        >
          Verify
        </button>
      </td>
    )}
  </tr>
);

export default function Dashboard() {
  const [unverifiedPosts, setUnverifiedPosts] = useState([]);
  const [verifiedPosts, setVerifiedPosts] = useState([]);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Remove JWT from localStorage
    navigate("/login");
  };

  useEffect(() => {
    async function fetchTransactions() {
      const token = localStorage.getItem("jwt");

      try {
        // Fetch unverified transactions
        const unverifiedResponse = await fetch(
          "https://localhost:3001/bank/transactions/unverified",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!unverifiedResponse.ok)
          throw new Error("Failed to fetch unverified transactions");

        const unverifiedTransactions = await unverifiedResponse.json();

        // Fetch verified transactions
        const verifiedResponse = await fetch(
          "https://localhost:3001/bank/transactions/verified",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!verifiedResponse.ok)
          throw new Error("Failed to fetch verified transactions");

        const verifiedTransactions = await verifiedResponse.json();

        // Update state with both unverified and verified transactions
        setUnverifiedPosts(unverifiedTransactions);
        setVerifiedPosts(verifiedTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Failed to load transactions.");
      }
    }

    fetchTransactions();
  }, []);

  async function verifyTransaction(id) {
    const token = localStorage.getItem("jwt");

    try {
      const response = await fetch(
        `https://localhost:3001/bank/transactions/${id}/verify`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Verification failed:", errorText);
        alert("Failed to verify transaction.");
        return;
      }

      // Move the transaction from unverified to verified
      const verifiedTransaction = unverifiedPosts.find(
        (post) => post._id === id
      );
      setUnverifiedPosts(unverifiedPosts.filter((post) => post._id !== id));
      setVerifiedPosts([
        ...verifiedPosts,
        { ...verifiedTransaction, verified: true },
      ]);
    } catch (error) {
      console.error("Error verifying transaction:", error);
      alert("An error occurred while verifying the transaction.");
    }
  }

  return (
    <div className="container">
      <h3 className="header">Transactions</h3>
      <button
        className="btn btn-danger"
        onClick={handleLogout}
        style={{ marginLeft: "20px" }}
      >
        Logout
      </button>

      {/* Unverified Transactions Table */}
      <h4 className="header">Unverified Transactions</h4>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Bank Name</th>
            <th>Branch Code</th>
            <th>Account Number</th>
            <th>Swift Code</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
            <th>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {unverifiedPosts.map((post) => (
            <Transaction
              post={post}
              verifyTransaction={() => verifyTransaction(post._id)}
              key={post._id}
            />
          ))}
        </tbody>
      </table>

      {/* Verified Transactions Table */}
      <h4 className="header">Verified Transactions</h4>
      <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Recipient</th>
            <th>Bank Name</th>
            <th>Branch Code</th>
            <th>Account Number</th>
            <th>Swift Code</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Provider</th>
          </tr>
        </thead>
        <tbody>
          {verifiedPosts.map((post) => (
            <Transaction post={post} key={post._id} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
