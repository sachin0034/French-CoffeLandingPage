import React, { useState } from "react";
import Footer from "../components/Footer/Footer";
import profileLogo from "../assets/menu.webp";
import CurvedText from "../components/Header/helper/CurvedText";

const MenuPage = () => {
  // Sample menu data
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Fruit Punch",
      description: "Mango Juice + Fruit Chunks & Vanilla Ice Cream",
      price: 219,
      originalPrice: 329,
      image: "https://via.placeholder.com/150", // Replace with actual image URL
    },
    {
      id: 2,
      name: "Strawberry Lemonade",
      description: "Strawberry + Sweet & Sour + Sprite",
      price: 219,
      originalPrice: 329,
      image: "https://via.placeholder.com/150",
    },
    {
      id: 3,
      name: "Evolution",
      description: "Passion Fruit + Strawberry + Lemon & Pineapple Juice",
      price: 219,
      originalPrice: 329,
      image: "https://via.placeholder.com/150",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <header className="bg-black text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          {/* <img
            src="https://pyramidcafe.in/images/pyramid-logo.png"
            alt="Pyramid Logo"
            className="h-10 mr-4"
          /> */}
          <div className="bg-black   text-white px-3 py-2 rounded focus:outline-none focus:ring focus:ring-yellow-500">
            Cavallo Bianco
          </div>
        </div>
        <div className="flex space-x-4">
          {/* <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
            Book a Table
          </button>
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
            Locations
          </button>
          <button className="bg-gray-800 px-4 py-2 rounded hover:bg-gray-700">
            Login
          </button> */}
        </div>
      </header>
      <section className="relative">
        <img
          src={profileLogo}
          alt="Main Banner"
          className="w-full h-28 md:h-72 object-cover" // Reduced height
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <CurvedText className="text-white text-3xl md:text-5xl font-bold" />{" "}
          {/* Adjusted text size */}
        </div>
      </section>

      <div className="flex">
        <aside className="w-1/4 bg-gray-100 p-4">
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          <ul>
            <li className="mb-2">
              <button className="text-yellow-500 hover:underline">
                Mocktails
              </button>
            </li>
            <li className="mb-2">
              <button className="text-gray-700 hover:underline">Shakes</button>
            </li>
            <li className="mb-2">
              <button className="text-gray-700 hover:underline">
                Soft Drinks
              </button>
            </li>
            <li className="mb-2">
              <button className="text-gray-700 hover:underline">
                All Day Favourites
              </button>
            </li>
          </ul>
        </aside>

        <main className="w-3/4 p-4">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-yellow-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between border-b border-gray-300 py-4"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded mr-4"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-yellow-500 font-bold">₹{item.price}</p>
                  <p className="text-sm text-gray-500 line-through">
                    ₹{item.originalPrice}
                  </p>
                  <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 mt-2">
                    Add Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MenuPage;
