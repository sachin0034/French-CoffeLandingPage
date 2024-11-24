import React from "react";
import profileLogo from "../../assets/car.jpg";
const Hero = () => {
  return (
    <div>
      <section className="relative">
        <img
          src={profileLogo}
          alt="Main Banner"
          className="w-full h-28 md:h-72 object-cover"
        />
      </section>
    </div>
  );
};

export default Hero;
