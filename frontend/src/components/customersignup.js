import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import bcrypt from "bcryptjs"; // Import bcryptjs for password hashing

export default function CustomerSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "firstName":
        setFirstName(value);
        break;
      case "lastName":
        setLastName(value);
        break;
      case "idNumber":
        setIdNumber(value);
        break;
      case "accountNumber":
        setAccountNumber(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  // Validation function
  const validateInput = () => {
    const nameRegex = /^[A-Za-z]{15,}$/;
    const idNumberRegex = /^[0-9]{11,}$/;
    const accountNumberRegex = /^[0-9]{10,}$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!nameRegex.test(firstName)) {
      alert("First name must be at least 15 characters and alphabetic.");
      return false;
    }
    if (!nameRegex.test(lastName)) {
      alert("Last name must be at least 15 characters and alphabetic.");
      return false;
    }
    if (!idNumberRegex.test(idNumber)) {
      alert("ID number must be numeric and at least 11 digits.");
      return false;
    }
    if (!accountNumberRegex.test(accountNumber)) {
      alert("Account number must be numeric and at least 10 digits.");
      return false;
    }
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 8 characters, including letters, numbers, and special characters.");
      return false;
    }
    return true;
  };

  async function handleSubmit(event) {
    event.preventDefault();

    // Validate inputs before submission
    if (!validateInput()) {
      return;
    }

    // Hash the password before sending it to the server
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      firstName,
      lastName,
      idNumber,
      accountNumber,
      password,
    };

    try {
      const response = await fetch("https://localhost:3001/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      // Navigate to login page after successful signup
      navigate("/login");
    } catch (error) {
      console.error("Signup Error:", error);
      alert("Signup failed! Please try again.");
    }
  }

  return (
    <div>
      <h3>Sign Up</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            className="form-control"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            className="form-control"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="idNumber">ID Number</label>
          <input
            type="text"
            className="form-control"
            id="idNumber"
            name="idNumber"
            value={idNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="accountNumber">Account Number</label>
          <input
            type="text"
            className="form-control"
            id="accountNumber"
            name="accountNumber"
            value={accountNumber}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <input type="submit" value="Sign Up" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
