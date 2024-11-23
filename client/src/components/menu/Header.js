import React from "react";

const Header = () => {
  return (
    <div>
      <header className="bg-gray text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex justify-center items-center text-black bg-white px-3 py-2 rounded-full focus:outline-none focus:ring focus:ring-yellow-500">
            <span className="text-sm font-semibold">Cavallo Bianco</span>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
