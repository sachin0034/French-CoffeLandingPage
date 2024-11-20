import React from 'react';
import './Header.css';
import { FaBars, FaCocktail, FaPizzaSlice, FaIceCream } from 'react-icons/fa';
import CurvedText from './helper/CurvedText';
import { Images } from '../../assets';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { Autoplay, Pagination } from 'swiper/modules';

function Header() {
  return (
    <header className="header">
      <div className="header-top">
        <FaBars className="menu-icon" />
      </div>
      <div className="logo-container">
        <img className="logo" src={Images.MAIN_LOGO} alt="Cavallo Bianco Logo" />
      </div>

      <div className="header-content">
        <CurvedText />
        <h2>RESTAURANT PIZZERIA</h2>
        <p>Pl. Chauderon 24, 1003 Lausanne</p>
        <button className="reserve-button">RÉSERVER</button>
      </div>

      {/* Carousel for icons */}

      <div className="icon-section">
        {/* Show Swiper only on mobile/tablet */}
        <div className="swiper-container">
        <Swiper
        spaceBetween={10}
        slidesPerView={1}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        pagination={{ clickable: true }}
        centeredSlides={true}
        modules={[Autoplay, Pagination]}
        breakpoints={{
          480: { slidesPerView: 1 },
          768: { slidesPerView: 1 },
          1024: { slidesPerView: 1 },
          1444: { slidesPerView: 4 },
        }}
      >
        <SwiperSlide>
          <div className="icon-with-description">
            <FaPizzaSlice size={40} />
            <p>Authentiques, savoureuses, aux saveurs italiennes incomparables</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="icon-with-description">
            <FaCocktail size={40} />
            <p>Vins fins et cocktails pour sublimer chaque bouche</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="icon-with-description">
            <FaIceCream size={40} />
            <p>Douceur italienne : tiramisu, glaces crémeuses et plus</p>
          </div>
        </SwiperSlide>
      </Swiper>
      
        </div>

        {/* Static icons for larger screens */}
        <div className="icon-static">
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
      </div>
    </header>
  );
}

export default Header;
