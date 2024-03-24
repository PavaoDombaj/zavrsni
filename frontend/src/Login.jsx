import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { booklyAuth } from "./assets";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';


export default function Login() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [cookies, setCookie] = useCookies(['access_token']);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/login",
        formData,
        {
          withCredentials: true,
          credentials: "include",
        }
      );

      const token = response.data.access_token;

      // Postavite kolačić na cijeli site
      // setCookie('access_token', token, { path: '/' });

      console.log("Auth token: ", token);

      console.log("Login successful", response.data);
      setAlertMessage("Login successful");
      setShowAlert(true);

      // Koristite navigate za preusmjeravanje
      // Odgodi preusmjeravanje nakon 5 sekundi
      setTimeout(() => {
        // Koristite navigate funkciju za preusmjeravanje
        navigate("/clients");
      }, 2000);

      // Handle successful login (redirect, show success message, etc.)
    } catch (error) {
      console.error("Login error", error.response.data);
      setAlertMessage("Invalid credentials. Please try again.");
      setShowAlert(true);
      // Handle login error (display error message, etc.)
    }
  };
  

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <div className="flex flex-col items-center min-h-screen pt-6 sm:justify-center sm:pt-0 bg-primary">
        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
          <div>
            <a href="/">
              <img
                src={booklyAuth}
                className="w-[230px] justify-items-center items-center image"
                alt="Bookly Logo"
              ></img>
            </a>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200
                    focus:ring-opacity-50 bg-neutral-200"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                />
              </div>
            </div>

            {showAlert && (
              <p
                className={
                  alertMessage.includes("successful")
                    ? "text-blue-500 text-sm mt-4"
                    : "text-red-500 text-sm mt-4"
                }
              >
                {alertMessage}
              </p>
            )}

            <div className="flex items-center justify-end mt-7">
              <Link
                to="/clients/register"
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Don't have an account? Register here.
              </Link>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold 
                tracking-widest text-white uppercase transition duration-150 ease-in-out
                 bg-gray-900 border border-transparent rounded-md active:bg-gray-900"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
