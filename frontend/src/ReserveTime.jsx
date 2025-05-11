import React, { useState, useEffect } from "react";
import { createContext, useContext } from "react";
import styles from "./style";
import { NavbarReserve, SignBlocks } from "./components";
import "./index.css";
import axios from "axios";

import Calendar from "react-calendar";
import DatePicker from "react-datepicker";

import TimePicker from "react-time-picker";

import "react-datepicker/dist/react-datepicker.css";
import "react-timepicker/timepicker.css";

import useAvailableTimes from "./components/useAvailabletimes";

import { useParams, Link, useLocation } from "react-router-dom";


const ReserveTime = () => {
  const location = useLocation();
  const { selectedWorker, selectedService } = location.state || {};
  const { id } = useParams();
  const [salonData, setSalonData] = useState(null);
  const [user, setUser] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const availableTimes = useAvailableTimes(
    selectedWorker,
    selectedService,
    selectedDate,
    user
  ); // Use custom hook

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  const handleChange = (time) => {
    setSelectedTime(time);
  };

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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  if (!selectedWorker || !selectedService) {
    return <div className="text-white">Loading...</div>; // ili neki drugi fallback
  }

  // Sada možete sigurno pristupiti svojstvima selectedWorker i selectedService
  return (
    <div className="bg-primary w-full overflow-hidden p-5">
      <div className="flex justify-center">
        {salonData && salonData.name && (
          <NavbarReserve salonName={salonData.name} step={2} />
        )}
      </div>
      <div className="m-5">
        <div className="flex bg-white mt-5 rounded-[20px]">
          <div className="w-7/12 p-6 border-2 border-red-900">
            <h2>
              Odabrani datum:{" "}
              {selectedDate ? selectedDate.toString() : "Nije odabran"}
            </h2>
            <div className="flex flex-col">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <DatePicker
                     selected={selectedDate}
                     onChange={setSelectedDate}
                     minDate={new Date()}
                     inline
                     className="border p-2 rounded-md" 
                   />
                </div>
              </div>
              {selectedDate && availableTimes && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  <h2 className="text-lg font-bold mb-2 col-span-full">
                    Available Times
                  </h2>
                  {availableTimes.map((time, index) => (
                    <button
                      key={index}
                      onClick={() => handleChange(time)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                    >
                      {new Date(time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </button>
                  ))}
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
                  {selectedDate &&
                    selectedService &&
                    selectedTime &&
                    selectedWorker && (
                      <div>
                        <Link
                          to={`/clients/salon/${id}/reserve/final`}
                          state={{
                            selectedWorker,
                            selectedService,
                            selectedDate,
                            selectedTime,
                          }}
                          className="btn inline-flex items-center justify-center px-4 py-2 mt-5 text-s font-semibold 
                          tracking-widest text-white transition duration-150 ease-in-out bg-gray-900 border border-transparent 
                          rounded-md hover:bg-fuchsia-900"
                        >
                          Rezerviraj termin
                        </Link>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReserveTime;
