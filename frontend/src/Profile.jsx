import React, { useState, useEffect } from "react";
import styles from "./style";
import { Navbar2, SignBlocks } from "./components";
import "./index.css";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [editMode, setEditMode] = useState(true);
  const [user, setUser] = useState(null);
  const [editPassword, setEditPassword] = useState(false);
  const [userData, setUserData] = useState({});
  const [formErrors, setFormErrors] = useState({}); // Dodano za praćenje grešaka u formi

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/checkToken",
          {
            withCredentials: true,
          }
        );

        // Postavite korisnika ako je prijavljen, inače postavite na null
        setUser(response.data.user || null);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Ako je 401 Unauthorized, korisnik nije prijavljen
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
    setFormErrors({}); // Resetiranje grešaka prilikom prebacivanja između promjene profila i promjene lozinke
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

      // Ensure userId is defined and valid
      if (!userId) {
        console.error("User ID is undefined or null");
        return;
      }

      // Construct the API endpoint
      let endpoint = `http://localhost:8800/api/users/${userId}`;
      console.log({ userId });

      // Make the PUT request
      const response = await axios.put(
        endpoint,
        { ...formData },
        {
          withCredentials: true,
        }
      );
      console.log(response);

      // Check if the update was successful (status code 200)
      if (response.status === 200) {
        // Update user data on the frontend after a successful update
        setUserData((prevUserData) => ({ ...prevUserData, ...formData }));
      }
    } catch (error) {
      // Log the error response for debugging
      console.error("Error response from the server:", error.response);

      // Check if the error.response object exists and has a 'data' property
      if (error.response && error.response.data && error.response.data.errors) {
        // Handle errors in the request, set errors in the component state
        setFormErrors(error.response.data.errors);
      } else {
        // If the error structure is different, handle it accordingly
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

      // Handle success, show alert, etc.
    } catch (error) {
      console.error("Password change error", error.response.data);

      // Handle error, show alert, etc.
    }
  };

  return ( /// TODO popravi formu nevalja savanje (NULL svejedno savea umjesto da ostavi stare podatke!)
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar2 />
          <hr />

          <SignBlocks></SignBlocks>
          {user && (
            <div
              className={`${styles.flexCenter} mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-400  rounded-lg`}
            >
              <div className="flex flex-col bg-white p-5 rounded-l-lg">
                <p
                  className={`font-poppins font-normal  leading-[30.8px] text-black text-3xl mb-3`}
                >
                  {userData.name}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] leading-[30.8px] text-gray-900 text-base mb-1`}
                >
                  Datum rođenja: {userData.birthDate}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] leading-[30.8px] text-gray-900 text-base mb-1`}
                >
                  Email: {userData.email}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] leading-[30.8px] text-gray-900 text-base mb-1`}
                >
                  Telefon: {userData.phone}
                </p>
                <p
                  className={`font-poppins font-normal text-[18px] leading-[30.8px] text-gray-900 text-base mb-1`}
                >
                  Tip obavijesti: email{" "}
                  {/*FIXNO samo mail moze nemoze se mijenjat*/}
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
                      Ime i prezime:
                      <input
                        type="text"
                        name="name"
                        value={
                          formData.name !== "" ? formData.name : userData.name
                        }
                        onChange={handleChange}
                      />
                    </label>
                    <label className="mb-3">
                      Telefon:
                      <input
                        type="text"
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
                      Datum rođenja:
                      <input
                        type="date"
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
                <form onSubmit={handleSubmitPassword}>
                  <div>
                    <div className="mt-4">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 undefined"
                      >
                        NEW password
                      </label>
                      <div className="flex flex-col items-start">
                        <input
                          type="password"
                          name="password"
                          value={handleChangePassowrdData.password}
                          onChange={handleChangePassowrdData}
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
                        Confirm NEW Password
                      </label>
                      <div className="flex flex-col items-start">
                        <input
                          type="password"
                          name="password_confirmation"
                          value={handleChangePassowrdData.password_confirmation}
                          onChange={handleChangePassowrdData}
                          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                      focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                      focus:ring-opacity-50 bg-neutral-200"
                        />
                      </div>
                      <button
                        className="bg-gray-500 hover:bg-fuchsia-700 text-white font-bold py-2 px-4 rounded mt-5 w-full"
                        type="submit"
                      >
                        Spremi lozinku
                      </button>
                    </div>
                  </div>
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
