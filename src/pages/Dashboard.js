import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Sidebar/Sidebar";
const Dashboard = () => {
  return (
    <div>
      <Navbar />
      {/* {loading ? <Loader /> : null} */}
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-gray-200 rounded-lg dark:border-gray-700 mt-14">
          <p className="text-gray-700 ">Invoices</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
