import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./assets/styles/fonts.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/styles/fonts.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddUser from "./pages/AddUser";
import PasswordReset from "./pages/PasswordReset";
import Menudetails from "./pages/Menudetails";
import MenuDescription from "./pages/MenuDescription";
import UserList from "./pages/UserList";
import ChefSuggestion from "./pages/ChefSuggesstin";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/Profile";
import AdminContact from "./pages/AdminContact";
import Categorypage from "./pages/CategoryPage";
import MenuPage from "./pages/MenuPage";
import NotFoundPage from "./pages/NotFound";
import DishPage from "./pages/DishPae";
import DishDescription from "./pages/DishDescription";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-user" element={<AddUser />} />
          <Route path="/user-list" element={<UserList />} />
          <Route path="/add-new-password" element={<PasswordReset />} />
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />}
          />
          <Route path="/menu-details" element={<Menudetails />} />
          <Route path="/menu-description/:date" element={<MenuDescription />} />
          <Route path="/dish-description/:date" element={<DishDescription />} />
          <Route path="/chef" element={<ChefSuggestion />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/contact" element={<AdminContact />} />
          <Route path="/category" element={<Categorypage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/dish" element={<DishPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
