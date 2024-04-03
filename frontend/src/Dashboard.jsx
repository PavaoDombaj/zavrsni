import React, { useState, useEffect } from "react";
import axios from "axios";
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
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import styles from "./style";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [salonsCount, setSalonsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [salons, setSalons] = useState([])
  const [users, setUsers] = useState([])

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
    const fetchSalons = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/salons",
        {
          withCredentials: true,
        });
        setSalonsCount(response.data.length);
        setSalons(response.data);
      } catch (error) {
        console.error("Error fetching salons:", error);
      }
    };

    fetchSalons();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/users",
        {
          withCredentials: true,
        });
        setUsersCount(response.data.length);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (!user || !user.isAdmin) {
    return <div
    className={`${styles.marginX} bg-neutral-200 p-5 w-[1000px] rounded-[10px] hover:bg-neutral-300 transition cursor-pointer flex flex-col justify-center items-center`}
  >
    {/* Registracija blok */}
    <Link to="/clients">
    <div className="flex-grow">
      <h2
        className={`${styles.heading2} mb-3 text-center text-slate-800`}
      >
        NISTE OVLASTENI
      </h2>
      <p className={`${styles.paragraph} text-center text-slate-700`}>
        za pristup dashboardu morate biti admin ili vlasnik salona
      </p>
      <p className={`${styles.paragraph} text-center text-red-700`}>
        klikom se vrati na stranicu salona
      </p>
    </div>
    </Link>
  </div>;
  }

  return (
    <div className="flex h-screen">
      {/* Lijeva navigacija */}
      <nav className="bg-gray-800 w-48 py-6 px-4 flex flex-col items-center sticky top-0 h-screen">
        <div className="flex flex-col items-center space-y-4">
          {[
            { icon: faHome, text: "Main" },
            { icon: faStore, text: "Salon", to: "/partner/dashboard/salon" }, // Dodajte to prop za preusmjeravanje na /salon
            { icon: faUsers, text: "Users" },
            { icon: faTable, text: "Tables" },
          ].map((item, index) => (
            <Link key={index} to={item.to || "#"} className="text-white text-lg flex items-center space-x-2"> {/* Dodajte Link element */}
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
          {/* Logo */}
          <div className="text-xl font-bold">Bookly Dashboard</div>
          {/* Search bar */}
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
          {/* Profile icon */}
          <div>
            <FontAwesomeIcon icon={faUser} />
          </div>
        </nav>
        <div className="bg-gray-900 rounded-[20px] p-8">
          <div className="flex flex-row">
            {[
              { title: "Clients", count: usersCount, icon: faUsers, color: "text-green-700" },
              { title: "Salon", count: salonsCount, icon: faBriefcase, color: "text-blue-500" },
              { title: "Rezervacija", count: "xyz", icon: faCalendarCheck, color: "text-red-500" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex flex-row mt-4 mb-4 bg-white rounded-[10px] p-4 flex-grow ${index > 0 ? 'ml-5' : ''}`}
              >
                <div className="w-2/3 flex flex-col items-start">
                  <p className="font-poppins font-normal text-gray-700 text-[30px] leading-[20px] mb-6">
                    {item.title}
                  </p>
                  <p className="font-poppins font-bold text-gray-700 text-[30px] leading-[20px]">
                    {item.count}
                  </p>
                </div>
                <div className="w-1/3 flex flex-col items-end">
                  <FontAwesomeIcon icon={faEye} className={`mb-3 text-gray-700`} />
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`${item.color} text-[40px]`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
