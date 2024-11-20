import React from "react";
import Header from "../components/Header/Header";
import Sections from "../components/Sections/Sections";
import ContactForm from "../components/contactForm/ContactForm";
import Footer from "../components/Footer/Footer";
const LandingPage = () => {
  return (
    <div className="App" style={{ margin: 0, padding: 0 , backgroundColor: '#723d12' }}>
      <Header />
      <br></br>
      <Sections />
      <br></br>
      <ContactForm />
      <Footer />
    </div>
  );
};

export default LandingPage;
