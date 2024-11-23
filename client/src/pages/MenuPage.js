import React, { useState } from "react";
import Footer from "../components/Footer/Footer";
import Hero from "../components/menu/Hero";
import MenuItem from "../components/menu/MenuItem";

const MenuPage = () => {
  return (
    <div
      style={{
        backgroundColor: "#a87442", 
        minHeight: "100vh",
      }}
    >
      <Hero />
      <MenuItem />
      <Footer />
    </div>
  );
};

export default MenuPage;
