import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar";
import Login from "./components/customerlogin";
import Home from "./components/home";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/customerlogin" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;
