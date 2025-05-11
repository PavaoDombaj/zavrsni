import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const AdminCreateSalon = () => {
  const [users, setUsers] = useState([]);
  const [salonData, setSalonData] = useState({
    name: "",
    owner: "",
    location: {
      city: "",
      address: "",
    },
    description: "",
    workingHours: [],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/users", {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSalonData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/salons", salonData, {
        withCredentials: true,
      });
      // Dodajte kod za obavještenje o uspješnom kreiranju salona
    } catch (error) {
      console.error("Error creating salon:", error);
    }
  };

  return (
    <div className="flex flex-col items-center mt-8">
      <h2 className="text-3xl font-semibold mb-4 text-center">Create Salon</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-4 shadow-lg rounded-lg">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={salonData.name}
            onChange={handleInputChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="owner">
            Owner:
          </label>
          <select
            id="owner"
            name="owner"
            value={salonData.owner}
            onChange={handleInputChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          >
            <option value="">Select Owner</option>
            {users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="city">
            City:
          </label>
          <input
            type="text"
            id="city"
            name="location.city"
            value={salonData.location.city}
            onChange={handleInputChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="address">
            Address:
          </label>
          <input
            type="text"
            id="address"
            name="location.address"
            value={salonData.location.address}
            onChange={handleInputChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="description">
            Description:
          </label>
          <textarea
            id="description"
            name="description"
            value={salonData.description}
            onChange={handleInputChange}
            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-24 overflow-auto"
          />
        </div>
        <button
          type="submit"
          className="inline-flex justify-center w-full border border-transparent px-4 py-2 bg-green-500 text-base font-medium shadow-sm text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm rounded-md"
        >
          <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
          Create Salon
        </button>
      </form>
    </div>
  );
};

export default AdminCreateSalon;
