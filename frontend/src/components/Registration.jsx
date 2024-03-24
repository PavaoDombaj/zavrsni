import React, { useState } from "react";
import axios from "axios";
import { booklyAuth } from "../assets";
import { Link } from "react-router-dom";
import { Alert } from "@material-tailwind/react";

export default function Registration() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const successfulReg ="Uspijesna registracija"

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    

    if (formData.password !== formData.password_confirmation) {
      // Passwords don't match, display an error message or prevent the form submission
      console.error("Passwords do not match");
      setAlertMessage("Passwords do not match");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8800/api/auth/register",
        formData
      );
      
      console.log("Registration successful", response.data);
      setAlertMessage(successfulReg)
      setShowAlert(true);
      return;
    } catch (error) {
      console.error("Registration error", error.response.data);
      // Handle registration error (display error message, etc.)
      setAlertMessage(error.response.data) ///fix kad se registriramo sa mailom koji vec postoji error baci i obrise sve sa stranice !!!!!!!!!!!
      setShowAlert(true);
      return;
    }
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
          <form onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Username
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                />
              </div>
            </div>
            <div className="mt-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 undefined"
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
                className="block text-sm font-medium text-gray-700 undefined"
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
            <div className="mt-4">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Confirm Password
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                />
              </div>
            </div>

            {/* Dodajte uvjetni paragraf za prikaz poruke o grešci */}
            {showAlert && (
              <p
                className={
                  alertMessage.includes({successfulReg})
                    ? "text-blue-500 text-sm mt-4"
                    : "text-red-500 text-sm mt-4"
                }
              >
                {alertMessage}
              </p>
            )}

            <div className="flex items-center justify-end mt-7">
              <Link
                to="/login"
                className="text-sm text-gray-600 underline hover:text-gray-900"
              >
                Already registered?
              </Link>
              <button
                type="submit"
                className=" inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold 
                tracking-widest text-white uppercase transition duration-150 ease-in-out
                 bg-gray-900 border border-transparent rounded-md active:bg-gray-900 
                 false"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
