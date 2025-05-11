import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./style";
import { Navbar2, SignBlocks } from "./components";
import "./index.css";
import { Link } from "react-router-dom";
 ///TO DO TREBA FIXAT kad se promjeni samo 1 podatak ostali se brisu
const Profile = () => {
  const [editMode, setEditMode] = useState(true);
  const [user, setUser] = useState(null);
  const [editPassword, setEditPassword] = useState(false);
  const [userData, setUserData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/checkToken",
          {
            withCredentials: true,
          }
        );
        setUser(response.data.user || null);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUser(null);
        } else {
          console.error("Error fetching auth token:", error);
        }
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/checkToken",
          {
            withCredentials: true,
          }
        );
        const userId = response.data.user.id;
        const userResponse = await axios.get(
          `http://localhost:8800/api/users/${userId}`,
          {
            withCredentials: true,
          }
        );
        setUserData(userResponse.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, []);

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phone: userData?.phone || "",
    birthDate: userData?.birthDate
      ? new Date(userData.birthDate).toISOString().split("T")[0]
      : "",
  });

  const [formDataPassword, setFormDataPassword] = useState({
    password: "",
    password_confirmation: "",
  });

  const handleChangePassowrdData = (e) => {
    setFormDataPassword({
      ...formDataPassword,
      [e.target.name]: e.target.value,
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditProfile = () => {
    setEditPassword(editMode);
    setEditMode(!editMode);
  };

  const handleChangePassowrd = () => {
    setEditMode(editPassword);
    setEditPassword(!editPassword);
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const IdResponse = await axios.get(
        "http://localhost:8800/api/auth/checkToken",
        {
          withCredentials: true,
        }
      );
      const userId = IdResponse.data.user.id;
      if (!userId) {
        console.error("User ID is undefined or null");
        return;
      }
  
      // Spojite postojeće podatke korisnika s promijenjenim podacima
      const updatedUserData = { ...userData, ...formData };
  
      let endpoint = `http://localhost:8800/api/users/${userId}`;
      const response = await axios.put(
        endpoint,
        updatedUserData,
        { withCredentials: true }
      );
  
      if (response.status === 200) {
        // Ažurirajte lokalno stanje korisničkih podataka samo ako je ažuriranje na backendu uspješno
        setUserData(updatedUserData);
      }
    } catch (error) {
      console.error("Error response from the server:", error.response);
      if (error.response && error.response.data && error.response.data.errors) {
        setFormErrors(error.response.data.errors);
      } else {
        console.error("Unexpected error structure:", error);
      }
    }
  };
  

  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const userId = user.id;
    if (formDataPassword.password !== formDataPassword.password_confirmation) {
      console.error("Passwords do not match");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8800/api/users/${userId}`,
        formDataPassword
      );
    } catch (error) {
      console.error("Password change error", error.response.data);
    }
  };

  const birthDate = userData.birthDate ? new Date(userData.birthDate) : null;
  const isValidDate = birthDate instanceof Date && !isNaN(birthDate);
  let formattedBirthDate = "Nepoznat datum rođenja";
  if (isValidDate) {
    const day = String(birthDate.getDate()).padStart(2, "0");
    const month = String(birthDate.getMonth() + 1).padStart(2, "0");
    const year = birthDate.getFullYear();
    formattedBirthDate = `${day}.${month}.${year}`;
  }

  return (
    <div className="bg-primary min-h-screen">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar2 />
          <hr />
          <SignBlocks></SignBlocks>
          {user && (
            <div
              className={`${styles.flexCenter} mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-white rounded-lg p-4`}
            >
              <div className="flex flex-col">
                <p className={`font-poppins font-normal  text-3xl mb-3`}>
                  {userData.name}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] text-gray-900 mb-1`}
                >
                  Datum rođenja: {formattedBirthDate}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] text-gray-900 mb-1`}
                >
                  Email: {userData.email}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] text-gray-900 mb-1`}
                >
                  Telefon: {userData.phone}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] text-gray-900 mb-1`}
                >
                  Tip obavijesti: email
                </p>
                <button
                  className="bg-gray-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded mt-3"
                  onClick={handleEditProfile}
                >
                  {editMode ? "Zatvori uređivanje" : "Uredi profil"}
                </button>
                <button
                  className="bg-gray-600 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded mt-3"
                  onClick={handleChangePassowrd}
                >
                  Promijeni lozinku
                </button>
              </div>
              {editMode && (
                <div className="text-xl">
                  <form className="flex flex-col" onSubmit={handleSubmit}>
                    <label className="mb-3">
                      <span className="block mb-1">Ime i prezime:</span>
                      <input
                        type="text"
                        className="border rounded p-1"
                        name="name"
                        value={
                          formData.name !== "" ? formData.name : userData.name
                        }
                        onChange={handleChange}
                      />
                    </label>
                    <label className="mb-3">
                      <span className="block mb-1">Telefon:</span>
                      <input
                        type="text"
                        className="border rounded p-1"
                        name="phone"
                        value={
                          formData.phone !== ""
                            ? formData.phone
                            : userData.phone
                        }
                        onChange={handleChange}
                      />
                    </label>
                    <label className="mb-3">
                      <span className="block mb-1">Datum rođenja:</span>
                      <input
                        type="date"
                        className="border rounded p-1"
                        name="birthDate"
                        value={
                          formData.birthDate !== ""
                            ? formData.birthDate
                            : userData.birthDate
                        }
                        onChange={handleChange}
                      />
                    </label>
                    {formErrors && formErrors.message && (
                      <p className="text-red-500 mb-3">{formErrors.message}</p>
                    )}
                    <button
                      className="bg-gray-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded mt-3"
                      type="submit"
                    >
                      Spremi promjene
                    </button>
                  </form>
                </div>
              )}
              {editPassword && (
                <form onSubmit={handleSubmitPassword} className="text-xl">
                  <div className="mt-4">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Nova lozinka
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formDataPassword.password}
                      onChange={handleChangePassowrdData}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="password_confirmation"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Potvrdi novu lozinku
                    </label>
                    <input
                      type="password"
                      name="password_confirmation"
                      value={formDataPassword.password_confirmation}
                      onChange={handleChangePassowrdData}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-gray-100"
                    />
                  </div>
                  <button
                    className="bg-gray-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded mt-5 w-full"
                    type="submit"
                  >
                    Spremi lozinku
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
