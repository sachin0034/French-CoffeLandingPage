import React from 'react';
import Header from './components/Header/Header';
import Sections from './components/Sections/Sections';
import ContactForm from './components/contactForm/ContactForm';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="App" style={{backgroundColor:'#723d12'}}>
      <Header />
      <br></br>
      <Sections />
      <br></br>
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
