import React from 'react';
import './Header.css';
import { FaBars, FaCocktail, FaPizzaSlice, FaIceCream } from 'react-icons/fa';
import CurvedText from './helper/CurvedText';
import { Images } from '../../assets';

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <FaBars className="menu-icon" />
      </div>
      <div className="logo-container">
        <img className="logo" src={Images.MAIN_LOGO} alt="Cavallo Bianco Logo"/>
      </div>
      <div className="header-content">
        <CurvedText />
        <h2>RESTAURANT PIZZERIA</h2>
        <p>Pl. Chauderon 24, 1003 Lausanne</p>
        <button className="reserve-button">RÉSERVER</button>
      </div>
      <div className="icon-section">
        <div className="icon-with-description">
          <FaPizzaSlice size={40} />
          <p>Authentiques, savoureuses, aux saveurs italiennes incomparables</p>
        </div>
        <div className="icon-with-description">
          <FaCocktail size={40} />
          <p>Vins fins et cocktails pour sublimer chaque bouche</p>
        </div>
        <div className="icon-with-description">
          <FaIceCream size={40} />
          <p>Douceur italienne : tiramisu, glaces crémeuses et plus</p>
        </div>
      </div>
    </header>

  );
}

export default Header;
