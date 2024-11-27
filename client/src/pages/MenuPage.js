import React, { useState } from "react";
import Footer from "../components/Footer/Footer";
import Hero from "../components/menu/Hero";
import MenuItem from "../components/menu/MenuItem";
import Header from "../components/menu/Header";

const MenuPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#a1887f",
        minHeight: "100vh",
      }}
    >
      {/* <Header /> */}
      <Hero />
      <MenuItem />
      <Footer />
    </div>
  );
};

export default MenuPage;
