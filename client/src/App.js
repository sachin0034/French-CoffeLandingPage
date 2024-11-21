import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./assets/styles/fonts.css";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import PasswordReset from "./pages/PasswordReset";
import Menudetails from "./pages/Menudetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-user" element={<AddUser />} />
        <Route path="/add-new-password" element={<PasswordReset />} />
        <Route path="/menu-details" element={<Menudetails />} />
      </Routes>
    </Router>
  );
}

export default App;
