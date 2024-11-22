import React from "react";
import './Loader.css'
const Loader = () => {
  return (
    <div>
      <div class="loader">
        <div class="panWrapper">
          <div class="pan">
            <div class="food"></div>
            <div class="panBase"></div>
            <div class="panHandle"></div>
          </div>
          <div class="panShadow"></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
