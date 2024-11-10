import React from "react";
import logo from "../logo.svg";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
// Here, we display our Navbar
export default function Navbar() {
  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <NavLink className="navbar-brand" to="/">
          <img style={{ width: 25 + "%" }} src={logo}></img>
        </NavLink>
        <div className="navbar" id="navbarSupportedContent">
          <ul className="navbar-nav ml-auto">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link" to="/customerlogin">
              Customer Login
            </NavLink>
            <NavLink className="nav-link" to="/customersignup">
              Customer Signup
            </NavLink>
            <NavLink className="nav-link" to="/employeelogin">
              Employee Login
            </NavLink>
          </ul>
        </div>
      </nav>
    </div>
  );
}
