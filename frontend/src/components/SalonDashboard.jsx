import React, { useState, useEffect } from "react";
import axios, { all } from "axios";
import { Link } from "react-router-dom"; // Uvoz React Router Link
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faHome,
  faStore,
  faUsers,
  faTable,
  faEye,
  faBriefcase,
  faCalendarCheck,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import styles from "../style";

const SalonDashboard = () => {
  const [user, setUser] = useState(null);
  const [salon, setSalon] = useState(null);
  const [formDataUpdate, setFormDataUpdate] = useState({
    name: "",
    locationAddress: "",
    locationCity: "",
    images: [],
  });


  let pristup = false;

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
        console.log(response);
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
    const fetchSalonsAndUsers = async () => {
      if (user && user.isAdmin) {
        const pristup = true;
        try {
          const salonsResponse = await axios.get(
            "http://localhost:8800/api/salons",
            {
              withCredentials: true,
            }
          );
          setSalonsCount(salonsResponse.data.length);
          setSalons(salonsResponse.data);

          const usersResponse = await axios.get(
            "http://localhost:8800/api/users",
            {
              withCredentials: true,
            }
          );
          setUsersCount(usersResponse.data.length);
          setUsers(usersResponse.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      } else {
        try {
          const workersResponse = await axios.get(
            "http://localhost:8800/api/worker",
            {
              withCredentials: true,
            }
          );
          const workers = workersResponse.data;

          // Provjeravamo je li ID korisnika prisutan u tablici workers
          const isUserWorker = workers.some((worker) => worker._id === user.id);

          if (isUserWorker) {
            console.log("Korisnik radi u salonu");
            let pristup = true;

            // Dohvaćamo sve salone
            const fetchSalons = async () => {
              try {
                const salonResponse = await axios.get(
                  "http://localhost:8800/api/salons"
                );
                const allSalons = salonResponse.data;
                console.log(allSalons);
                console.log(user.id);

                // Pronalazimo salon u kojem korisnik radi
                const userSalon = allSalons.find((salon) =>
                  salon.workers.includes(user.id)
                );

                if (userSalon) {
                  // Ako je pronađen salon u kojem korisnik radi
                  console.log("Salon u kojem korisnik radi:", userSalon);

                  // Dohvaćamo detalje tog salona
                  const salonDetailResponse = await axios.get(
                    `http://localhost:8800/api/salons/${userSalon._id}`
                  );
                  const salonDetail = salonDetailResponse.data;

                  // Postavljamo salon u state
                  setSalon(salonDetail);
                } else {
                  console.log("Korisnik radi u nepoznatom salonu.");
                }
              } catch (error) {
                console.error("Error fetching salon data:", error);
              }
            };

            fetchSalons();
          } else {
            // Korisnik nije administrator, radnik ili vlasnik salona
            console.log(
              "Korisnik nije administrator niti radnik ili vlasnik salona."
            );
            let pristup = false;
          }
        } catch (error) {
          console.error("Error fetching workers:", error);
        }
      }
    };

    fetchSalonsAndUsers();
  }, [user]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormDataUpdate({ ...formDataUpdate, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", formDataUpdate.name);
      formData.append("locationAddress", formDataUpdate.locationAddress);
      formData.append("locationCity", formDataUpdate.locationCity);
      formDataUpdate.images.forEach((image) => {
        formData.append("images", image);
      });
  
      // Dodajemo user.id i salon._id u FormData objekt
      formData.append("userId", user.id);
      formData.append("salonId", salon._id);
  
      const response = await axios.put(
        `http://localhost:8800/api/salons/${salon._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Salon updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating salon:", error);
    }
  };
  

  if (!salon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Lijeva navigacija */}
      <nav className="bg-gray-800 w-48 py-6 px-4 flex flex-col items-center sticky top-0 h-screen">
        <div className="flex flex-col items-center space-y-4">
          {[
            { icon: faHome, text: "Main" },
            { icon: faStore, text: "Salon" },
            { icon: faUsers, text: "Users" },
            { icon: faTable, text: "Tables" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.to || "#"}
              className="text-white text-lg flex items-center space-x-2"
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow bg-gray-100">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center ">
          <div className="text-xl font-bold">Bookly Dashboard</div>
          <div className="flex">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 mr-4 bg-gray-700 rounded-lg"
            />
            <button className="px-3 py-1 bg-gray-700 rounded-lg">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div>
            <FontAwesomeIcon icon={faUser} />
          </div>
        </nav>
        <div className="bg-gray-900 rounded-[20px] h-full p-8">
          <p className="font-poppins text-[20px] text-white">
            {salon.name} | Owner: {salon.owner.name}
          </p>
          <div className="bg-white flex flex-col rounded-[10px] p-6">
            <div className="flex flex-row">
              <FontAwesomeIcon icon={faPenToSquare} />
              <p className="font-poppins font-bold text-[20px] text-gray-700">
                UPDATE SALON
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Salon name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="name"
                    value={formDataUpdate.name}
                    onChange={handleInputChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="locationAddress"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Salon location
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="locationAddress"
                    value={formDataUpdate.locationAddress}
                    onChange={handleInputChange}
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                  />
                  <input
                    type="text"
                    name="locationCity"
                    value={formDataUpdate.locationCity}
                    onChange={handleInputChange}
                    placeholder="city"
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                  />
                </div>
              </div>

              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="images"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Images
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="file"
                    name="images"
                    onChange={(e) =>
                      setFormDataUpdate({
                        ...formDataUpdate,
                        images: [...formDataUpdate.images, e.target.files[0]],
                      })
                    }
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                   focus:border-indigo-300 focus:ring focus:ring-indigo-200 
                   focus:ring-opacity-50 bg-neutral-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
              >
                Update Salon
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonDashboard;
