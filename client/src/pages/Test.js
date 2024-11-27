import React from "react";
import pizzaImage from "../assets/images/Pizza.png";

const OverlapImageLayout = () => {
  return (
    <div className="relative">
      {/* First Section */}
      <div className="bg-[#713d11] px-6 lg:px-20 py-10 lg:py-16">
        <h3 className="text-2xl lg:text-4xl font-bold text-white text-center lg:text-left uppercase">
          A PROPOS
        </h3>
        <p className="text-base lg:text-lg leading-relaxed text-white text-center lg:text-left">
          Situé au cœur de Lausanne, près de la Place Chauderon, Cavallo Bianco
          vous propose une cuisine italienne authentique, alliant saveurs
          méditerranéennes et ingrédients frais.
        </p>
      </div>

      {/* Image Overlap */}
      <div className="absolute left-1/2 top-0 lg:top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src={pizzaImage}
          alt="Overlapping"
          className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[250px] lg:h-[250px] rounded-full border-4 border-white shadow-lg"
        />
      </div>

      {/* Second Section */}
      <div className="bg-[#f5e2cb] px-6 lg:px-20 py-10 lg:py-16 mt-[100px] lg:mt-[125px]">
        <h3 className="text-2xl lg:text-4xl font-bold text-[#713d11] text-center lg:text-left uppercase">
          HORAIRES D'OUVERTURE
        </h3>
        <p className="text-base lg:text-lg leading-relaxed text-[#713d11] text-center lg:text-left">
          Lundi-Samedi: 10H - 00H
        </p>
        <p className="text-base lg:text-lg leading-relaxed text-[#713d11] text-center lg:text-left">
          Dimanche: 17H - 00H
        </p>
      </div>
    </div>
  );
};

export default OverlapImageLayout;
