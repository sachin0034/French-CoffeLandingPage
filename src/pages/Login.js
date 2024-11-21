import axios from "axios";
import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
const Login = () => {
  const [post, setPost] = useState({
    name: "",
    password: "",
  });

  const handleInput = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const data = await axios.post("", post, config);
      console.log(data);
    } catch (error) {
      console.log("Error: " + error);
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen">
        {/* Image Section */}
        <div className="md:hidden w-full flex justify-center  p-4 pb-10">
          <img
            src="https://media.cnn.com/api/v1/images/stellar/prod/190411154654-07-bouillon-restaurants-paris.jpg?q=w_3101,h_1744,x_0,y_0,c_fill"
            alt="Flowers"
            className="w-3/4 h-auto rounded-2xl shadow-xl object-cover"
          />
        </div>

        {/* Left Section */}
        <div className="flex flex-col justify-center items-center md:w-1/2 bg-white px-6 md:px-12">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Welcome Back 👋
            </h2>
            <p className="text-gray-600 mb-6">
              Today is a new day. It's your day. You shape it. Sign in to start
              managing your projects.
            </p>
            <form onSubmit={login}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Example@email.com"
                  required
                  name="name"
                  onChange={handleInput}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm text-gray-600 mb-1"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <a href="#" className="text-blue-500 text-sm">
                  Forgot Password?
                </a>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
              >
                Log in
              </button>
            </form>
          </div>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center p-4 ">
          <img
            src="https://media.cnn.com/api/v1/images/stellar/prod/190411154654-07-bouillon-restaurants-paris.jpg?q=w_3101,h_1744,x_0,y_0,c_fill"
            alt="Flowers"
            className="w-1/2 md:w-1/3 lg:w-3/4 h-auto rounded-2xl shadow-xl object-cover"
                      />
        </div>
      </div>
    </>
  );
};

export default Login;
