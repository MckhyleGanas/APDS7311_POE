import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";

export default function Home() {
  return (
    <div className="container text-center mt-5">
      <h1>Welcome to the Banking App</h1>
      <div className="mt-4">
        <NavLink to="/customerlogin" className="btn btn-primary mx-2">
          Login for Customer
        </NavLink>
        <NavLink to="/employeelogin" className="btn btn-secondary mx-2">
          Login for Employee
        </NavLink>
      </div>
    </div>
  );
}
