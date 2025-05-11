import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import styles from "./style";
import { NavbarReserve, SignBlocks } from "./components";
import "./index.css";
import axios from "axios";

import { useParams, Link, useLocation } from "react-router-dom";

const ReserveFinal = () => {
  const location = useLocation();
  const { selectedWorker, selectedService, selectedDate, selectedTime } =
    location.state || {};
  const { id } = useParams();
  const [salonData, setSalonData] = useState(null);
  const [user, setUser] = useState(null);


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


  const makeReservation = async () => {
     try {
      // Ovdje zamijenite URL-om i podacima koje trebate poslati u zahtjevu
      const response = await axios.post("http://localhost:8800/api/reservation", {
        selectedWorker,
        selectedService,
        selectedTime,
        salonData,
        user,
        // Dodajte ostale potrebne podatke za rezervaciju
      });
      // Obrada odgovora ako je potrebno
      console.log("Reservation made:", response.data);
    } catch (error) {
      // Obrada greške ako je potrebno
      console.error("Error making reservation:", error);
    } 
    console.log( "selectedDate " + selectedDate + "selected time " + selectedTime +
     "service "+ selectedService._id + "worker " +  selectedWorker._id +  "salonID " + salonData._id)
  };


  if (!selectedWorker || !selectedService) {
    return <div className="text-white">Loading...</div>; // ili neki drugi fallback
  }

  // Sada možete sigurno pristupiti svojstvima selectedWorker i selectedService
  return (
    <div className="bg-primary w-full overflow-hidden p-5">
      <div className="flex justify-center">
        {salonData && salonData.name && (
          <NavbarReserve salonName={salonData.name} step={3} />
        )}
      </div>
      <h2 className="text-white">Confirmation</h2>
      <p className="text-white">Selected Worker: {selectedWorker.name}</p>
      <p className="text-white">Selected Service: {selectedService.name}</p>

      <div className="m-5">
        <div className="flex bg-white mt-5 rounded-[20px]">
          <div className="w-7/12 p-6 border-2 border-red-900">
            <h2>
              Odabrani datum:{" "}
              {selectedDate ? selectedDate.toString() : "Nije odabran"}
            </h2>
            <div className="flex flex-col">
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
                      </div>
                    )}

                    {selectedTime && (
                      <div>
                        <p className="font-poppins text-xl font-bold mt-2 text-gray-900">
                          {new Date(selectedTime).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "numeric",
                          })}{" "}
                          {new Date(selectedTime).toLocaleTimeString("en-GB", {
                            hour: "numeric",
                            minute: "numeric",
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                  {
                    selectedService &&
                    selectedTime &&
                    selectedWorker && (
                      <div>
                        <button onClick={makeReservation} className="tn inline-flex items-center justify-center px-4 py-2 mt-5 text-s font-semibold 
                          tracking-widest text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent 
                          rounded-md hover:bg-fuchsia-900">POTVRDI TERMIN</button>
                      </div>
                    )}
                </div>
              )}
       

            </div>
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

              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveFinal;
