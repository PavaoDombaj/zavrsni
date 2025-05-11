import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faUser,
  faHome,
  faStore,
  faUsers,
  faTable,
  faPenToSquare,
  faBriefcase,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import styles from "./style";

const AdminSalon = () => {
  const [user, setUser] = useState(null);
  const [salons, setSalons] = useState([]);
  const [selectedSalonId, setSelectedSalonId] = useState(null);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    locationAddress: "",
    locationCity: "",
  });

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
      const fetchSalons = async () => {
        try {
          const response = await axios.get("http://localhost:8800/api/salons", {
            withCredentials: true,
          });
          setSalons(response.data);
        } catch (error) {
          console.error("Error fetching salons:", error);
        }
      };

      fetchSalons();
    }
  }, [user]);

  useEffect(() => {
    if (selectedSalonId) {
      const fetchSalonDetails = async () => {
        try {
          const salonResponse = await axios.get(
            `http://localhost:8800/api/salons/${selectedSalonId}`,
            { withCredentials: true }
          );
          setSelectedSalon(salonResponse.data);

          const workersResponse = await axios.get(
            `http://localhost:8800/api/worker/salon/${selectedSalonId}`,
            { withCredentials: true }
          );
          setWorkers(workersResponse.data);

          const servicesResponse = await axios.get(
            `http://localhost:8800/api/services/salon/${selectedSalonId}`,
            { withCredentials: true }
          );
          setServices(servicesResponse.data);
        } catch (error) {
          console.error("Error fetching salon details:", error);
        }
      };

      fetchSalonDetails();
    }
  }, [selectedSalonId]);

  const handleSalonInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = (e) => {
    const serviceId = e.target.value;
    setSelectedServiceId(serviceId);
    const service = services.find((s) => s._id === serviceId);
    setSelectedService(service);
  };

  useEffect(() => {
    if (selectedSalonId) {
      const fetchSalonDetails = async () => {
        try {
          const salonResponse = await axios.get(
            `http://localhost:8800/api/salons/${selectedSalonId}`,
            { withCredentials: true }
          );
          setSelectedSalon(salonResponse.data);
  
          const workersResponse = await axios.get(
            `http://localhost:8800/api/worker/salon/${selectedSalonId}`,
            { withCredentials: true }
          );
          setWorkers(workersResponse.data);
  
          const servicesResponse = await axios.get(
            `http://localhost:8800/api/services/salon/${selectedSalonId}`,
            { withCredentials: true }
          );
          setServices(servicesResponse.data);
  
          // Reset selected worker and service
          setSelectedWorkerId(null);
          setSelectedWorker(null);
          setSelectedServiceId(null);
          setSelectedService(null);
        } catch (error) {
          console.error("Error fetching salon details:", error);
        }
      };
  
      fetchSalonDetails();
    }
  }, [selectedSalonId]);
  

  const handleWorkerChange = (e) => {
    const workerId = e.target.value;
    setSelectedWorkerId(workerId);
    const worker = workers.find((w) => w._id === workerId);
    setSelectedWorker(worker);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedServiceId) {
        const response = await axios.put(
          `http://localhost:8800/api/services/${selectedServiceId}`,
          selectedService,
          { withCredentials: true }
        );
        console.log("Service updated successfully:", response.data);
        window.location.reload();
      } else {
        const response = await axios.put(
          `http://localhost:8800/api/salons/${selectedSalon._id}`,
          formData,
          { withCredentials: true }
        );
        console.log("Salon updated successfully:", response.data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating:", error);
    }
  };

  const handleDeleteService = async () => {
    try {
      await axios.delete(
        `http://localhost:8800/api/services/${selectedServiceId}`,
        { withCredentials: true }
      );
      console.log("Service deleted successfully");
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:8800/api/worker/${selectedWorkerId}`,
        selectedWorker,
        { withCredentials: true }
      );
      console.log("Worker updated successfully:", response.data);
      window.location.reload();
    } catch (error) {
      console.error("Error updating worker:", error);
    }
  };

  const handleDeleteWorker = async () => {
    try {
      await axios.delete(
        `http://localhost:8800/api/worker/${selectedWorkerId}`,
        { withCredentials: true }
      );
      console.log("Worker deleted successfully");
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Lijeva navigacija */}
      <nav className="bg-gray-800 w-48 py-6 px-4 flex flex-col items-center sticky top-0 h-screen">
        <div className="flex flex-col items-center space-y-4">
          {[
            { icon: faHome, text: "Main", to:"/admin" },
            { icon: faStore, text: "Salon", to: "/admin/salon" },
            { icon: faUsers, text: "Users", to: "/admin/users" },
            { icon: faTable, text: "Tables" },
          ].map((item, index) => (
            <Link key={index} to={item.to || "#"} className="text-white text-lg flex items-center space-x-2">
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.text}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow bg-gray-100">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center">
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
          <div className="bg-white flex flex-col rounded-[10px] p-6">
            <div className="flex flex-row">
              <FontAwesomeIcon icon={faPenToSquare} />
              <p className="font-poppins font-bold text-[20px] text-gray-700">
                SELECT SALON
              </p>
            </div>
            <select
              onChange={(e) => setSelectedSalonId(e.target.value)}
              value={selectedSalonId || ""}
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
            >
              <option value="">Select a salon</option>
              {salons.map((salon) => (
                <option key={salon._id} value={salon._id}>
                  {salon.name}
                </option>
              ))}
            </select>
          </div>

          {selectedSalon && (
            <>
              <div className="bg-white flex flex-col rounded-[10px] p-6 mt-6">
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
                      className="block text-sm font-medium text-gray-700"
                    >
                      Salon name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleSalonInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                    />
                  </div>
                  <div className="mt-4 flex flex-col">
                    <label
                      htmlFor="locationAddress"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Salon address
                    </label>
                    <input
                      type="text"
                      name="locationAddress"
                      value={formData.locationAddress}
                      onChange={handleSalonInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                    />
                  </div>
                  <div className="mt-4 flex flex-col">
                    <label
                      htmlFor="locationCity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Salon city
                    </label>
                    <input
                      type="text"
                      name="locationCity"
                      value={formData.locationCity}
                      onChange={handleSalonInputChange}
                      className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className={`${styles.defaultButton} w-full`}
                    >
                      Update Salon
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white flex flex-col rounded-[10px] p-6 mt-6">
                <div className="flex flex-row">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <p className="font-poppins font-bold text-[20px] text-gray-700">
                    UPDATE SERVICE
                  </p>
                </div>
                <select
                  onChange={handleServiceChange}
                  value={selectedServiceId || ""}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  ))}
                </select>
                {selectedService && (
                  <form onSubmit={handleSubmit}>
                    <div className="mt-4 flex flex-col">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Service name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedService.name}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            name: e.target.value,
                          })
                        }
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                      />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label
                        htmlFor="duration"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Service duration
                      </label>
                      <input
                        type="number"
                        name="duration"
                        value={selectedService.duration}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            duration: e.target.value,
                          })
                        }
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                      />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label
                        htmlFor="price"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Service price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={selectedService.price}
                        onChange={(e) =>
                          setSelectedService({
                            ...selectedService,
                            price: e.target.value,
                          })
                        }
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className={`${styles.defaultButton} w-full`}
                      >
                        Update Service
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteService}
                        className={`${styles.deleteButton} w-full mt-4`}
                      >
                        Delete Service
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="bg-white flex flex-col rounded-[10px] p-6 mt-6">
                <div className="flex flex-row">
                  <FontAwesomeIcon icon={faPenToSquare} />
                  <p className="font-poppins font-bold text-[20px] text-gray-700">
                    UPDATE WORKER
                  </p>
                </div>
                <select
                  onChange={handleWorkerChange}
                  value={selectedWorkerId || ""}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                >
                  <option value="">Select a worker</option>
                  {workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name}
                    </option>
                  ))}
                </select>
                {selectedWorker && (
                  <form onSubmit={handleWorkerSubmit}>
                    <div className="mt-4 flex flex-col">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Worker name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={selectedWorker.name}
                        onChange={(e) =>
                          setSelectedWorker({
                            ...selectedWorker,
                            name: e.target.value,
                          })
                        }
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                      />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Worker description
                      </label>
                      <textarea
                        name="description"
                        value={selectedWorker.description}
                        onChange={(e) =>
                          setSelectedWorker({
                            ...selectedWorker,
                            description: e.target.value,
                          })
                        }
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                      />
                    </div>
                    <div className="mt-4 flex flex-col">
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Worker experience
                      </label>
                      <input
                        type="number"
                        name="experience"
                        value={selectedWorker.experience}
                        onChange={(e) =>
                          setSelectedWorker({
                            ...selectedWorker,
                            experience: e.target.value,
                          })
                        }
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                      />
                    </div>
                    <div className="mt-4">
                      <button
                        type="submit"
                        className={`${styles.defaultButton} w-full`}
                      >
                        Update Worker
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteWorker}
                        className={`${styles.deleteButton} w-full mt-4`}
                      >
                        Delete Worker
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminSalon;
