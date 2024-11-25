import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import LargeImg2 from "../../assets/Carousel/LargeImg2.jpg";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function Carousel() {
  return (
    <div>
      <div className="w-full h-auto bg-black">
        <Swiper
          loop={true}
          spaceBetween={30}
          centeredSlides={true}
          modules={[]}
          className="mySwiper"
        >
          {/* First Slide */}
          <SwiperSlide>
            <img
              src={LargeImg2}
              className="w-full"
              alt="Carousel Image 1"
              loading="lazy"
            />
          </SwiperSlide>
          {/* Second Slide */}
          <SwiperSlide>
            <img
              src={LargeImg2}
              className="w-full"
              alt="Carousel Image 2"
              loading="lazy"
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  );
}

export default Carousel;
