import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Using react-router-dom for navigation

export default function EmployeeLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const credentials = { email, password };

    try {
      const response = await fetch("https://localhost:3001/employee/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      const { token } = data;

      // Save the JWT to localStorage
      localStorage.setItem("jwt", token);

      // Navigate to a different page after successful login (optional)
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed! Please check your credentials.");
    }
  }

  return (
    <div>
      <h3>Employee Login</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            value={email}
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
          <input type="submit" value="Login" className="btn btn-primary" />
        </div>
      </form>
    </div>
  );
}
