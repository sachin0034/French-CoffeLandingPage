import React from "react";
import "./Sections.css";
import { Images } from "../../assets";
import pizzaImage from "../../assets/images/Pizza.png";


// <div className="flex flex-wrap justify-center items-center w-full p-0 box-border">
// {/* Card 1: A PROPOS */}
// <div className="flex flex-col justify-center items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/3 h-[350px] bg-[#f5e2cb] overflow-hidden shadow-lg relative mb-5">
//   <div className="pt-10 text-center bg-[#f5e2cb] w-full absolute top-5 left-1/2 transform -translate-x-1/2 z-10 text-[#713d11]">
//     <h3 className="text-[24px] sm:text-[30px] text-[#713d11] tracking-[3px] sm:tracking-[4.5px]">A PROPOS</h3>
//   </div>
//   <div className="flex justify-center items-center w-full h-full relative z-1">
//     <img src={Images.NOODLES} alt="Card 1" className="max-w-[60%] sm:max-w-[45%] object-contain mt-8 sm:mt-16 mx-auto" />
//   </div>
// </div>

// {/* Card 2: MENU */}
// <div className="flex flex-col justify-center items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/3 h-[350px] bg-[#f5e2cb] overflow-hidden shadow-lg relative mb-5">
//   <div className="pt-10 text-center bg-[#f5e2cb] w-full absolute top-5 left-1/2 transform -translate-x-1/2 z-10 text-[#713d11]">
//     <h3 className="text-[24px] sm:text-[30px] text-[#713d11] tracking-[3px] sm:tracking-[4.5px]">MENU</h3>
//   </div>
//   <div className="flex justify-center items-center w-full h-full relative z-1">
//     <img src={Images.PUDDING} alt="Card 2" className="max-w-[60%] sm:max-w-[45%] object-contain mt-8 sm:mt-16 mx-auto" />
//   </div>
// </div>

// {/* Card 3: CONTACT */}
// <div className="flex flex-col justify-center items-center w-full sm:w-1/2 md:w-1/3 lg:w-1/3 h-[350px] bg-[#f5e2cb] overflow-hidden shadow-lg relative mb-5">
//   <div className="pt-10 text-center bg-[#f5e2cb] w-full absolute top-5 left-1/2 transform -translate-x-1/2 z-10 text-[#713d11]">
//     <h3 className="text-[24px] sm:text-[30px] text-[#713d11] tracking-[3px] sm:tracking-[4.5px]">CONTACT</h3>
//   </div>
//   <div className="flex justify-center items-center w-full h-full relative z-1">
//     <img src={Images.SUSHE} alt="Card 3" className="max-w-[60%] sm:max-w-[45%] object-contain mt-8 sm:mt-16 mx-auto" />
//   </div>
// </div>
// </div>

function Sections() {
  return (
    <>
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

      <div className="relative">
        {/* First Section */}
        <div
          className="bg-[#713d11] px-6 lg:px-20 py-10 lg:py-16 flex flex-col justify-center lg:col-span-2"
          style={{ maxHeight: "420px" }}
        >
          <div className="lg:flex lg:justify-end">
            {/* Added flex for right alignment of text */}
            <div className="lg:w-1/2">
              <h3 className="text-2xl lg:text-4xl font-bold mb-4 uppercase text-center lg:text-left text-white">
                A PROPOS
              </h3>
              <p className="text-base lg:text-lg leading-relaxed text-center lg:text-left text-white">
                Situé au cœur de Lausanne, près de la Place Chauderon, Cavallo
                Bianco vous propose une cuisine italienne authentique, alliant
                saveurs méditerranéennes et ingrédients frais. Découvrez des
                pizzas artisanales, pâtes fraîches et autres plats délicieux,
                préparés avec passion.
              </p>
              <p className="mt-4 text-base lg:text-lg leading-relaxed text-center lg:text-left text-white">
                Réservez dès aujourd’hui et vivez la dolce vita!
              </p>
            </div>
          </div>
        </div>

        {/* Image Overlap */}
        <div className="absolute left-0 top-0 lg:top-1/2 transform lg:translate-y-[-68%] z-10">
          <img
            src={pizzaImage}
            alt="Overlapping"
            className="w-[150px] h-[150px] md:w-[200px] md:h-[200px] lg:w-[1050px] lg:h-[630px] ml-[-180px]"
          />
        </div>

        {/* Second Section */}
        <div
          className="bg-[#f5e2cb] px-6 lg:px-20 py-10 lg:py-16 mt-[90px] lg:mt-[125px]"
          style={{ maxHeight: "500px" }}
        >
          <div className="lg:flex lg:justify-end">
            <div className="lg:w-1/2">
              <h3 className="text-2xl lg:text-4xl font-bold text-[#713d11] text-center lg:text-left uppercase mb-2">
                HORAIRES D'OUVERTURE
              </h3>
              <p className="text-base lg:text-lg leading-relaxed text-[#713d11] text-center lg:text-left mb-3 font-bold">
                LUNDI-SAMEDI <span className="ml-[20px]"> 10H - 00H </span>
              </p>
              <p className="text-base lg:text-lg leading-relaxed text-[#713d11] text-center lg:text-left font-bold">
                DIMANCHE <span className="ml-[55px]">17H - 00H</span>
              </p>
            </div>
          </div>
          <br />
          <br />

          <div
            className="lg:flex lg:justify-end relative py-2 lg:py-2"
            style={{ maxHeight: "135px" }}
          >
            <div className="lg:w-1/2">
              <h3 className="text-xl lg:text-4xl font-bold text-[#713d11] text-center lg:text-left uppercase mb-3">
                HORAIRES DE LA CUISINE
              </h3>

              <p className="text-base lg:text-lg leading-relaxed text-[#713d11] text-center lg:text-left mb-3 font-bold sm:mr-[-120px]">
                LUNDI-SAMEDI
                <span className="ml-0 lg:ml-[20px] sm:ml-0">
                  11H30-14H
                </span>{" "}
                <br />
                <span className="ml-0 lg:ml-[142px] sm:ml-0 mr-0 lg:mr-[-100px]">
                  18H30-23H
                </span>
              </p>

              <p className="text-base lg:text-lg leading-relaxed text-[#713d11] text-center lg:text-left mb-3 font-bold">
                DIMANCHE <span className="ml-[40px]"> 18H30 - 23H </span>
              </p>

              {/* Responsive H2 Heading */}
              <h2
                className="absolute top-0 left-0 transform lg:-translate-x-0 lg:-translate-y-0 text-4xl md:text-5xl lg:text-5xl font-bold italic uppercase text-[#713d11] z-10 
             hidden sm:block md:ml-0 lg:ml-[-30px] mb-10 mt-0 text-center lg:text-left"
                style={{
                  letterSpacing: "0.1em",
                  fontFamily: "Gilroy, sans-serif",
                }}
              >
                <span className="relative mb-6 block font-bold">Mamma</span>
                <span className="mt-6 block">Mia!</span>
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sections;
