import React from 'react';
import './Footer.css';
import { Images } from '../../assets';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={Images.BG_MAIN_LOGO} alt="Logo" />
        </div>
        <div className="social-icons">
          <a href="#" aria-label="Instagram">
            <img src={Images.INSTAGRAM_ICON} alt="Instagram" style={{ width: '80px', height: '80px' }} />
          </a>
          <a href="#" aria-label="Facebook">
            <img src={Images.FACEBOOK_ICON} alt="Facebook" style={{ width: '80px', height: '80px' }} />
          </a>
          <a href="#" aria-label="LinkedIn">
            <img src={Images.LINKEDIN_ICON} alt="LinkedIn" style={{ width: '80px', height: '80px' }} />
          </a>
        </div>
      </div>
      <p>© 2020-2024 Logixcube - Cornu. Tous droits réservés.</p>
    </footer>
  );
}

export default Footer;
