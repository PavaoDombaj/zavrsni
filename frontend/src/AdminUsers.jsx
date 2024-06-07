import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faHome, faStore, faUsers, faTable } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import styles from "./style";

const AdminUsers = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [usersCount, setUsersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/checkToken",
          { withCredentials: true }
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
    if (user && user.isAdmin) {
      const fetchUsers = async () => {
        try {
          const response = await axios.get("http://localhost:8800/api/users", {
            withCredentials: true,
          });
          setUsers(response.data);
          setUsersCount(response.data.length);
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };

      fetchUsers();
    }
  }, [user]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Lijeva navigacija */}
      <nav className="bg-gray-800 w-48 py-6 px-4 flex flex-col items-center sticky top-0 h-screen">
        <div className="flex flex-col items-center space-y-4">
          {[
            { icon: faHome, text: "Main", to:"/admin" },
            { icon: faStore, text: "Salon", to: "/admin/salon" }, // Dodajte to prop za preusmjeravanje na /salon
            { icon: faUsers, text: "Users", to: "/admin/users" },
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
          <div className="flex flex-col mt-6">
            <div className="font-poppins font-bold text-gray-700 text-[20px] leading-[20px] mb-4">
              Users:
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col"
                >
                  <div className="font-poppins font-bold text-gray-700">
                    {user.name}
                  </div>
                  <div className="font-poppins font-normal text-gray-700">
                    Email: {user.email}
                  </div>
                  <div className="font-poppins font-normal text-gray-700">
                    Phone: {user.phone}
                  </div>
                  {/* Dodajte ostale informacije o korisnicima koje želite prikazati */}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
