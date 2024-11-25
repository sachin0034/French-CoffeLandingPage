import React from "react";
import { Images } from "../../assets";
const Header = () => {
  return (
    <div>
      <header style={{ backgroundColor: "#f5e2cb" }}>
        <nav
          className="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800"
          style={{ backgroundColor: "#f5e2cb" }}
        >
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            <a href="https://flowbite.com" className="flex items-center">
              <img
                src={Images.BG_MAIN_LOGO}
                className="mr-3 h-10 sm:h-9 w-15"
                alt="Flowbite Logo"
              />
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
