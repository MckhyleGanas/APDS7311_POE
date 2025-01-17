import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import CustomerLogin from "./components/customerlogin";
import EmployeeLogin from "./components/employeelogin";
import CustomerSignup from "./components/customersignup";
import Dashboard from "./components/dashboard";
import CustomerHome from "./components/customerhome";
import Home from "./components/home";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/customerlogin" element={<CustomerLogin />} />
        <Route path="/customersignup" element={<CustomerSignup />} />
        <Route path="/customerhome" element={<CustomerHome />} />
        <Route path="/employeelogin" element={<EmployeeLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
};

export default App;
