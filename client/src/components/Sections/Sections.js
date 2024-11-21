import React from 'react';
import './Sections.css';
import { Images } from '../../assets';

function Sections() {
  return (
    <div className="cards-container">
      <div className="card">
        <div className="card-text">
          <h3>A PROPOS</h3>
        </div>
        <div className="card-image">
          <img src={Images.NOODLES} alt="Card 1" />
        </div>
      </div>
      <div className="card">
        <div className="card-text">
          <h3>MENU</h3>
        </div>
        <div className="card-image">
          <img src={Images.PUDDING} alt="Card 2" />
        </div>
      </div>
      <div className="card">
        <div className="card-text">
          <h3>CONTACT</h3>
        </div>
        <div className="card-image">
          <img src={Images.SUSHE} alt="Card 3" />
        </div>
      </div>
    </div>
  );
}

export default Sections;
