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
  faStar,
  faEye,
  faBriefcase,
  faCalendarCheck,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import SignBlocks from "./SignBlocks";
import styles from "../style";

const SalonDashboardMain = () => {
  const [user, setUser] = useState(null);
  const [salon, setSalon] = useState(null);
  const [usersCount, setUsersCount] = useState(null)
  const [reservationCount, setReservationCount] = useState(null)
  

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


  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("salon id _ " + salon._id)
        const response = await axios.get(
            `http://localhost:8800/api/salons/stats/${salon._id}`,
          {
            withCredentials: true,
          }
        );
        console.log(response.data.numberOfUsers)
        // Dobijte broj korisnika iz odgovora i postavite ga u stanje
        setUsersCount(response.data.numberOfUsers);
        setReservationCount(response.data.totalReservations)
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchData();
  }, [salon]);



  if (!salon || !usersCount || !reservationCount) {
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
      <div className="flex flex-row">
        {[
          {
            title: "Clients",
            count: usersCount,
            icon: faUsers,
            color: "text-green-700",
          },
          {
            title: "Rezervacija",
            count: reservationCount,
            icon: faCalendarCheck,
            color: "text-red-500",
          },
          {
            title: "Rating",
            count: salon.rating,
            icon: faStar,
            color: "text-yellow-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex flex-row mt-4 mb-4 bg-white rounded-[10px] p-4 flex-grow ${
              index > 0 ? "ml-5" : ""
            }`}
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
  );
};

export default SalonDashboardMain;
