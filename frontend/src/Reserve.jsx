import React, { useState, useEffect } from "react";
import { createContext, useContext}from 'react';
import styles from "./style";
import { NavbarReserve, SignBlocks } from "./components";
import "./index.css";
import axios from "axios";
import ReserveTime from "./ReserveTime";

import Calendar from "react-calendar";
import DatePicker from "react-datepicker";
import { useParams, Link } from "react-router-dom";

import "react-calendar/dist/Calendar.css";
import "react-datepicker/dist/react-datepicker.css";

export const useReservation = () => {
  return useContext(ReservationContext);
};

const Reserve = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [salonData, setSalonData] = useState(null);
  const [services, setServices] = useState([]); // Stanje za pohranu usluga
  const [selectedService, setSelectedService] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8800/api/salons/${id}`
        );

        setSalonData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching salon data:", error);
      }
    };

    fetchData();
  }, [id]);

  const imageUrl =
    salonData && salonData.images && salonData.images.length > 1
      ? salonData.images[1]
      : "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png";

  // Logirajte sliku u konzolu
  useEffect(() => {
    //console.log("Učitana slika:", imageUrl);
  }, [imageUrl]);

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
          `http://localhost:8800/api/worker/salon/${id}`
        );
        console.log("Workers for salon " + id + ":", response.data);
        setWorkers(response.data);
        // Ovdje možete dalje obraditi podatke ili ih prikazati u vašem korisničkom sučelju
      } catch (error) {
        console.error("Error fetching worker data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Salonid: " + id);
        const response = await axios.get(
          `http://localhost:8800/api/services/salon/${id}`
        );
        console.log("Services:", response.data);
        setServices(response.data);
        // Ovdje možete dalje obraditi podatke ili ih prikazati u vašem korisničkom sučelju
      } catch (error) {
        console.error("Error fetching services:", error);
        // Ovdje možete obraditi grešku ili prikazati odgovarajuću poruku korisniku
      }
    };

    fetchData();
  }, [id]);

  const handleServiceClick = (service) => {
    setSelectedService(service);
  };
  const handleWorkerClick = (worker) => {
    setSelectedWorker(worker);
  };

  useEffect(() => {
    console.log(selectedService);
  }, [selectedService]);

  useEffect(() => {
    console.log(selectedWorker);
  }, [selectedWorker]);

  return (
    <div className={`${styles.paddingX} bg-primary w-full overflow-hidden`}>
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        {salonData && salonData.name && (
          <NavbarReserve salonName={salonData.name} step={1} />
        )}
      </div>
      <hr className="mt-4" />
      <div className={`m-5`}>
        <div className="flex bg-white mt-5 rounded-[20px]">
          {/* Lijeva strana */}
          <div className="w-7/12 p-6  border-2 border-red-900">
            <p className="font-poppins font-bold text-black text-[29px] leading-[20px] mb-5">
              Usluge
            </p>
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-gray-300 mb-3 rounded-[10px] p-4 hover:bg-gray-500 cursor-pointer"
                onClick={() => handleServiceClick(service)}
              >
                <h3 className="font-poppins font-semibold text-lg text-gray-900 leading-[28px]">
                  {service.name}
                </h3>
                {service.description && (
                  <p className="font-poppins font-normal text-gray-700 text-sm leading-[20px] mb-2">
                    {service.description}
                  </p>
                )}
                <p className="font-poppins font-normal text-gray-700 text-sm leading-[20px]">
                  Price: {service.price} €
                </p>
                <p className="font-poppins font-normal text-gray-700 text-sm leading-[20px]">
                  Trajanje: {service.durationMinutes} min
                </p>
              </div>
            ))}
            <div>
              <p className="font-poppins font-bold text-black text-[29px] leading-[20px] mb-5">
                RADNICI
              </p>
            </div>
            {workers.map((worker, index) => (
              <div
                key={index}
                className="bg-gray-300 mb-3 rounded-[10px] p-4 hover:bg-gray-500 cursor-pointer"
                onClick={() => handleWorkerClick(worker)}
              >
                <h3 className="font-poppins font-semibold text-lg text-gray-900 leading-[28px]">
                  {worker.name}
                </h3>
                <p className="font-poppins font-normal text-gray-700 text-sm leading-[20px]">
                  Role: {worker.role}{" "}
                </p>
              </div>
            ))}
          </div>

          {/* Desna strana */}
          <div className="w-5/12 p-6 ">
            <div className=" flex flex-col justify-center items-center">
              {imageUrl && (
                <img src={imageUrl} className="w-[200px]" alt="Salon Image" />
              )}
              <p className="font-poppins font-bold text-black text-[25px] leading-[20px] mb-5">
                {salonData && salonData.name}
              </p>
              <p className="font-poppins font-normal text-black text-[18px] leading-[20px] mb-3">
                {salonData && salonData.location && salonData.location.address},{" "}
                {salonData && salonData.location && salonData.location.city}
              </p>
            </div>
            <div className="flex flex-col items-start ">
              <p className="font-poppins font-normal text-gray-700 text-[16px] leading-[20px]">
                telefon: x
              </p>
              <p className="font-poppins font-normal text-gray-700 text-[16px] leading-[20px] mb-5">
                mail: y
              </p>

              {selectedService && (
                <div>
                  <p className="font-poppins font-bold text-black text-[25px] leading-[20px] mb-5">
                    Odabrane usluge
                  </p>
                  <div className="bg-gray-300 mb-3 rounded-[10px] p-4 w-full">
                    <h3 className="font-poppins font-semibold text-lg text-gray-900 leading-[28px]">
                      {selectedService.name}
                    </h3>
                    <p
                      className={`font-poppins font-normal text-gray-700 text-sm leading-[20px]`}
                    >
                      Price: {selectedService.price} €
                    </p>
                    <p
                      className={`font-poppins font-normal text-gray-700 text-sm leading-[20px]`}
                    >
                      Trajanje: {selectedService.durationMinutes} min
                    </p>
                    {selectedWorker && (
                      <div>
                        <h3 className="font-poppins font-semibold text-lg text-gray-900 leading-[28px]">
                          Radnik: {selectedWorker.name}
                        </h3>

                        <Link
                          to={`/clients/salon/${id}/reserve/time`} state={({selectedWorker, selectedService})}
                            
                          className="btn inline-flex items-center justify-center px-4 py-2 mt-5 text-s font-semibold 
  tracking-widest text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent 
  rounded-md hover:bg-fuchsia-900"
                        >
                          Rezerviraj termin
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reserve;
