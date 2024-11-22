import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState({ email: "", password: "" });
  const [emailForReset, setEmailForReset] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleInput = (e) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/auth/forgot-password`,
        { email: emailForReset },
        { headers: { "Content-Type": "application/json" } }
      );

      setLoading(false);
      if (response.data.success) {
        toast.success("Password reset link sent to your email!");
        setShowModal(false);
      } else {
        toast.error(response.data.message || "Error sending reset link.");
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Something went wrong. Try again."
      );
    }
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/auth/login`,
        post,
        config
      );

      setLoading(false);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("admin", response.data.isAdmin);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        toast.error(response.data.message || "Invalid credentials!");
      }
    } catch (error) {
      setLoading(false);
      toast.error(
        error.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row h-screen bg-white">
        <div className="w-full flex justify-center mt-8 md:hidden">
          <img
            src="https://media.cnn.com/api/v1/images/stellar/prod/190411154654-07-bouillon-restaurants-paris.jpg?q=w_3101,h_1744,x_0,y_0,c_fill"
            alt="Flowers"
            className="w-5/6 sm:w-3/4 md:w-3/4 h-auto rounded-2xl object-cover"
          />
        </div>

        <div className="flex flex-col justify-center items-center md:w-1/2 px-6 md:px-12 mt-4 mx-4 md:mt-0 md:mx-0 max-w-7xl">
          <div className="w-full max-w-md lg:w-4/5 lg:ml-8 bg-[#f4f4f4] p-8 rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 mt-4 sm:mt-10 sm:ml-6 lg:w-2/3 lg:ml-8">
              Welcome Back 👋
            </h2>
            <p className="text-gray-600 mb-6 lg:w-4/5 lg:ml-8">
              Sign in to start managing your projects.
            </p>
            {loading && <Loader />}
            <form onSubmit={login} className="lg:w-4/5 lg:ml-8">
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  placeholder="Example@email.com"
                  required
                  name="email"
                  onChange={handleInput}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleInput}
                  className="w-full px-4 py-2 border border-gray-400 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
                  placeholder="At least 8 characters"
                  required
                />
              </div>
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="text-blue-500 text-sm"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-200 shadow-md"
              >
                Log in
              </button>
            </form>
          </div>
        </div>

        <div className="hidden md:flex md:w-1/2 items-center justify-center p-4 lg:mt-2 lg:mx-4 mr-0 max-w-7xl">
          <img
            src="https://media.cnn.com/api/v1/images/stellar/prod/190411154654-07-bouillon-restaurants-paris.jpg?q=w_3101,h_1744,x_0,y_0,c_fill"
            alt="Flowers"
            className="w-7/8 lg:w-7/8 lg:h-[95vh] h-auto rounded-2xl object-cover"
          />
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-lg shadow-md w-96 transition-all">
            <h2 className="text-lg font-bold text-white mb-4">Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <label htmlFor="reset-email" className="block text-sm text-white mb-2">
                Enter your email to receive a password reset link:
              </label>
              <input
                type="email"
                id="reset-email"
                className="w-full px-3 py-2 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={emailForReset}
                onChange={(e) => setEmailForReset(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Send Reset Link
              </button>
            </form>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-red-500 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;

