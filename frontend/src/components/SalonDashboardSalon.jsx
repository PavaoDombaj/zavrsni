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

import SignBlocks from "./SignBlocks";
import styles from "../style";

const SalonDashboardSalon = () => {
  const [user, setUser] = useState(null);
  const [salon, setSalon] = useState(null);
  const [workers, setWorkers] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [selectedWorkerId, setselectedWorkerId] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    locationAddress: "",
    locationCity: "",
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
          console.log(workers);

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
                  try {
                    const servicesResponse = await axios.get(
                      `http://localhost:8800/api/services/salon/${userSalon._id}`,
                      { withCredentials: true }
                    );
                    const services = servicesResponse.data;
                    setServices(services);
                  } catch (error) {
                    console.error("Error fetching data:", error);
                  }
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

  const handleSalonInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleServiceChange = async (e) => {
    const serviceId = e.target.value;
    setSelectedServiceId(serviceId);
    const service = services.find((s) => s._id === serviceId);
    setSelectedService(service);
  };
  const handleWorkerChange = async (e) => {
    const workerId = e.target.value;
    setSelectedWorkerId(workerId);
    const worker = workers.find((w) => w._id === workerId);
    setSelectedService(worker);
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
          `http://localhost:8800/api/salons/${salon._id}`,
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
        {
          withCredentials: true,
        }
      );
      console.log("Service deleted successfully");
      // Dodajte logiku za osvježavanje ili ponovno učitavanje podataka ako je potrebno
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(salon.id);
        const response = await axios.get(
          `http://localhost:8800/api/worker/salon/${salon.id}`
        );

        setWorkers(response.data);
        console.log(workers);
      } catch (error) {
        console.error("Error fetching worker data:", error);
      }
    };

    fetchData();
  }, [salon]);

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
      console.error("Error updating:", error);
    }
  };
  const handleDeleteWorker = async () => {
    try {
      await axios.delete(
        `http://localhost:8800/api/worker/${selectedServiceId}`,
        {
          withCredentials: true,
        }
      );
      console.log("Wowrker deleted successfully");
      // Dodajte logiku za osvježavanje ili ponovno učitavanje podataka ako je potrebno
    } catch (error) {
      console.error("Error deleting worker:", error);
    }
  };

  if (!salon) {
    return <div>Loading...</div>;
  }
  if (user.id === salon.owner.ownerId) {
    console.log("user je gazda salona");
    const gazda = true;
  }

  return (
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
                value={formData.name || salon.name}
                onChange={handleSalonInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Salon description
            </label>
            <div className="flex flex-col items-start">
              <textarea
                name="description"
                value={formData.description || salon.description}
                onChange={handleSalonInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="ownerName"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Owner name
            </label>
            <div className="flex flex-col items-start">
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName || salon.owner.name}
                onChange={handleSalonInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
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
                value={formData.locationAddress || salon.location.address}
                onChange={handleSalonInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
              />
              <input
                type="text"
                name="locationCity"
                value={formData.locationCity || salon.location.city}
                onChange={handleSalonInputChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
              />
            </div>
          </div>

          {/* Dodajemo polje za unos radnog vremena */}

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          >
            Update Salon
          </button>
        </form>
      </div>

      <div className="bg-white flex flex-col rounded-[10px] p-6 mt-6">
        <div className="flex flex-row">
          <FontAwesomeIcon icon={faPenToSquare} />
          <p className="font-poppins font-bold text-[20px] text-gray-700">
            UPDATE SERVICES
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Select Service:
            </label>
            <div className="flex flex-col items-start">
              <select
                name="service"
                value={selectedServiceId}
                onChange={handleServiceChange}
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
            </div>
          </div>
          {selectedServiceId && (
            <div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Service name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="name"
                    value={selectedService.name || ""}
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
              </div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Service description
                </label>
                <div className="flex flex-col items-start">
                  <textarea
                    name="description"
                    value={selectedService.description || ""}
                    onChange={(e) =>
                      setSelectedService({
                        ...selectedService,
                        description: e.target.value,
                      })
                    }
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="durationMinutes"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Duration (minutes)
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="number"
                    name="durationMinutes"
                    value={selectedService.durationMinutes || ""}
                    onChange={(e) =>
                      setSelectedService({
                        ...selectedService,
                        durationMinutes: e.target.value,
                      })
                    }
                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
                  />
                </div>
              </div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Price
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="number"
                    name="price"
                    value={selectedService.price || ""}
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
              </div>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          >
            Update Service
          </button>
          <button
            type="button"
            onClick={handleDeleteService}
            className="bg-red-500  ml-3 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
          >
            Delete Service
          </button>
        </form>

        <form onSubmit={handleWorkerSubmit}>
          <div className="mt-4 flex flex-col">
            <label
              htmlFor="service"
              className="block text-sm font-medium text-gray-700 undefined"
            >
              Select Worker:
            </label>
            <div className="flex flex-col items-start">
              <select
                name="service"
                value={selectedWorkerId}
                onChange={handleWorkerChange}
                className="block w-full mt-1 border-gray-300 rounded-md shadow-sm
        focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-neutral-200"
              >
                <option value="">Select a Worker</option>
                {workers &&
                  workers.map((worker) => (
                    <option key={worker._id} value={worker._id}>
                      {worker.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          {selectedWorkerId && (
            <div>
              <div className="mt-4 flex flex-col">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 undefined"
                >
                  Worker name
                </label>
                <div className="flex flex-col items-start">
                  <input
                    type="text"
                    name="name"
                    value={selectedWorker.name || ""}
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
              </div>
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded hover:bg-blue-600"
          >
            Update Worker
          </button>
          <button
            type="button"
            onClick={handleDeleteWorker}
            className="bg-red-500  ml-3 text-white px-4 py-2 mt-4 rounded hover:bg-red-600"
          >
            Delete Worker
          </button>
        </form>
      </div>
    </div>
  );
};

export default SalonDashboardSalon;
