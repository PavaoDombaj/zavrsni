import React, { useState } from "react";
import axios from "axios";
import { booklyAuth } from "./assets";
import { Link } from "react-router-dom";
import { Alert } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function Registration() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    name: "",
    phone: "",
  });
  const successfulReg = "Uspijesna registracija";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    if (formData.password !== formData.password_confirmation) {
      // Zaporke se ne poklapaju, prikazi poruku greške
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
      setAlertMessage(successfulReg);
      setShowAlert(true);
      try {
        // AUTOMATSKI LOGIRAJ KORISNIKA
        const response = await axios.post(
          "http://localhost:8800/api/auth/login",
          formData,
          {
            withCredentials: true,
            credentials: "include",
          }
        );

        const token = response.data.access_token;

        setAlertMessage("Login successful");
        setShowAlert(true);

        // Odgodi preusmjeravanje nakon 2 sekundi
        setTimeout(() => {
          // navigate funkcija za preusmjeravanje
          navigate("/clients");
        }, 2000);
      } catch (error) {
        console.error("Login error", error.response.data);
        setAlertMessage("Invalid credentials. Please try again.");
        setShowAlert(true);
      }
      return;
    } catch (error) {
      console.error("Registration error", error.response.data);
      // Handle registration error (display error message, etc.)
      setAlertMessage(error.response.data); ///fix kad se registriramo sa mailom koji vec postoji error baci i obrise sve sa stranice !!!!!!!!!!!
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
            <div className="mt-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Ime i Prezime
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
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
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 undefined"
              >
                Telefon
              </label>
              <div className="flex flex-col items-start">
                <input
                  type="phone"
                  name="phone"
                  value={formData.phone}
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

            {/* Didatni uvjetni paragraf za prikaz poruke o grešci */}
            {showAlert && (
              <p
                className={
                  alertMessage.includes({ successfulReg })
                    ? "text-blue-500 text-sm mt-4"
                    : "text-red-500 text-sm mt-4"
                }
              >
                {alertMessage}
              </p>
            )}

            <div className="flex items-center justify-end mt-7">
              <Link
                to="/clients/login"
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
