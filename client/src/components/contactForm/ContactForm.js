import React from 'react';
import './ContactForm.css';
import { Images } from '../../assets';

function ContactForm() {
  return (
    <div className="contact-form-container">
      <div className="contact-form">
        <h2>CONTACTEZ-NOUS</h2>
        <p>Nous sommes à votre disposition pour toute demande de renseignements ou services.</p>
        <form>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="" required />
            </div>
            <div className="form-group">
              <label>Numéro de téléphone</label>
              <input type="tel" placeholder="" required />
            </div>
          </div>
          <div className="form-group full-width">
            <label>Message</label>
            <textarea placeholder="" required></textarea>
          </div>
          <div className="form-submit">
            <button type="submit">Envoyer</button>
          </div>
        </form>
      </div>
      <div className="contact-image">
        <img src={Images.CONTACT_SEC_IMAGE} alt="Contact Us" />
      </div>
    </div>
  );
}

export default ContactForm;
