import React, { useState, useEffect } from "react";
import axios from "axios";

const SalonDashboardSalon = () => {
  const [user, setUser] = useState(null);
  const [salon, setSalon] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [workerReservations, setWorkerReservations] = useState([]);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/checkToken",
          {
            withCredentials: true,
          }
        );

        setUser(response.data.user || null);
      } catch (error) {
        console.error("Error fetching auth token:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchSalonsAndUsers = async () => {
      if (user && user.isAdmin) {
        // Provjeriti da li je korisnik administrator
        const pristup = true;
        try {
          // Dobiti sve salone
          const salonsResponse = await axios.get(
            "http://localhost:8800/api/salons",
            {
              withCredentials: true,
            }
          );
          setSalonsCount(salonsResponse.data.length);
          setSalons(salonsResponse.data);

          // Dobiti sve korisnike
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
          // Dobiti sve radnike
          const workersResponse = await axios.get(
            "http://localhost:8800/api/worker",
            {
              withCredentials: true,
            }
          );
          const workers = workersResponse.data;

          // Provjeriti da li je korisnik radnik u nekom salonu
          const isUserWorker = workers.some((worker) => worker._id === user.id);

          if (isUserWorker) {
            console.log("Korisnik radi u salonu");
            let pristup = true;

            // Dobiti sve salone
            const fetchSalons = async () => {
              try {
                const salonResponse = await axios.get(
                  "http://localhost:8800/api/salons"
                );
                const allSalons = salonResponse.data;
                console.log(allSalons);
                console.log(user.id);

                // Pronaći salon u kojem korisnik radi
                const userSalon = allSalons.find((salon) =>
                  salon.workers.includes(user.id)
                );

                if (userSalon) {
                  // Ako je pronađen salon u kojem korisnik radi
                  console.log("Salon u kojem korisnik radi:", userSalon);

                  // Dobiti detalje tog salona
                  const salonDetailResponse = await axios.get(
                    `http://localhost:8800/api/salons/${userSalon._id}`
                  );
                  const salonDetail = salonDetailResponse.data;

                  // Postaviti salon u state
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
        if (salon) {
          const response = await axios.get(
            `http://localhost:8800/api/worker/salon/${salon._id}`
          );

          setWorkers(response.data);
        }
      } catch (error) {
        console.error("Error fetching worker data:", error);
      }
    };

    fetchData();
  }, [salon]);

  useEffect(() => {
    setCurrentDate(new Date().toISOString().split("T")[0]);
  }, []);

  const handleWorkerChange = (event) => {
    setSelectedWorker(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleShowReservations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/reservation/reservations/worker/${selectedWorker}`,
        { withCredentials: true }
      );

      // Dobiti rezervacije s dodatnim informacijama o salonu, radniku i usluzi
      const reservationsWithDetails = await Promise.all(
        response.data.map(async (reservation) => {
          const salonResponse = await axios.get(
            `http://localhost:8800/api/salons/${reservation.salonId}`
          );
          const workerResponse = await axios.get(
            `http://localhost:8800/api/worker/${reservation.workerId}`
          )
          const userResponse = await axios.get(
            `http://localhost:8800/api/users/${reservation.userId}`
          );
          const serviceResponse = await axios.get(
            `http://localhost:8800/api/services/${reservation.serviceId}`
          );

          const salon = salonResponse.data;
          const worker = workerResponse.data;
          const service = serviceResponse.data;
          const userR = userResponse.data;

          return {
            ...reservation,
            salon,
            worker,
            service,
            userR,
          };
        })
      );

      setWorkerReservations(reservationsWithDetails);
    } catch (error) {
      console.error("Error fetching worker reservations:", error);
    }
  };

  const handleMarkAttendance = async (reservationId, dosao) => {
    try {
      await axios.put(
        `http://localhost:8800/api/reservation/${reservationId}`,
        { dosao },
        { withCredentials: true }
      );
      // Osvježiti rezervacije nakon označavanja prisutnosti
      handleShowReservations();
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      await axios.delete(
        `http://localhost:8800/api/reservation/${reservationId}`,
        { withCredentials: true }
      );
      // Osvježiti rezervacije nakon brisanja
      handleShowReservations();
    } catch (error) {
      console.error("Error deleting reservation:", error);
    }
  };

  if (!salon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 rounded-[20px] h-full p-8">
      <p className="font-poppins text-[20px] text-white">
        {salon.name} | Owner: {salon.owner.name}
      </p>
      <div className="mt-4">
        <label htmlFor="workerSelect" className="text-white">
          Select Worker:
        </label>
        <select
          id="workerSelect"
          className="ml-2 border border-gray-400 rounded px-2 py-1"
          onChange={handleWorkerChange}
          value={selectedWorker}
        >
          <option value="">Select a Worker</option>
          {workers.map((worker) => (
            <option key={worker._id} value={worker._id}>
              {worker.name}
            </option>
          ))}
        </select>
        <label htmlFor="dateSelect" className="text-white ml-4">
          Select Date:
        </label>
        <input
          type="date"
          id="dateSelect"
          className="ml-2 border border-gray-400 rounded px-2 py-1"
          onChange={handleDateChange}
          value={selectedDate}
        />
        <button
          onClick={handleShowReservations}
          className="ml-2 bg-slate-200 rounded-xl font-bold font-poppins p-3"
        >
          Show Reservations
        </button>
      </div>
      {workerReservations.length > 0 ? (
        <div className="mt-4">
          <h2 className="text-white font-poppins text-lg mb-2">
            Worker Reservations:
          </h2>
          <ul>
            {workerReservations.map((reservation) => {
              // Filter reservations for the selected date
              const reservationDate = new Date(reservation.reservationTime);
              const formattedReservationDate = reservationDate
                .toISOString()
                .split("T")[0];
              if (formattedReservationDate === selectedDate) {
                // Format reservation time
                const startTime = new Date(reservation.reservationTime);
                const endTime = new Date(reservation.reservationTime);
                endTime.setMinutes(
                  endTime.getMinutes() + reservation.durationMinutes
                );
                const startTimeFormatted = startTime
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(":00 ", " ");
                const endTimeFormatted = endTime
                  .toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                  .replace(":00 ", " ");

                  
                  if(currentDate>endTime){
                    reservation.stara = true
                  }

                return (
                  <li key={reservation._id} className="text-white mb-4">
                    <div>
                      <strong>Reservation time:</strong> {startTimeFormatted} -{" "}
                      {endTimeFormatted}
                    </div>
                    <div>
                      <strong>Service:</strong> {reservation.service.name}
                    </div>
                    <div>
                      <strong>dosao:</strong>{" "}
                      {reservation.dosao ? "Yes" : reservation.dosao==false ?"null" : "ne"}
                    </div>
                    {reservation.stara &&( ///bilo !reservation.dosao sad ovo treba napravit samo ako je stara
                   
                    <>
                      <button
                        onClick={() =>
                          handleMarkAttendance(reservation._id, true)
                        }
                        className="bg-green-700 hover:bg-green-900 rounded-xl font-bold font-poppins p-2 mt-2 mr-2"
                      >
                        Dosao
                      </button>
                      <button
                      onClick={() =>
                        handleMarkAttendance(reservation._id, false)
                      }
                      className="bg-orange-700 hover:bg-orange-900 rounded-xl font-bold font-poppins p-2 mt-2 mr-2"
                    >
                      Nije dosao
                    </button>
                    </>
                    )}
            
                    <button
                      onClick={() => handleDeleteReservation(reservation._id)}
                      className="bg-red-500 rounded-xl font-bold font-poppins p-2 mt-2"
                    >
                      Delete Reservation
                    </button>
                  </li>
                );
              } else {
                return null;
              }
            })}
          </ul>
        </div>
      ) : (
        <div className="text-white mt-4">
          No reservations for {selectedDate}.
        </div>
      )}
    </div>
  );
};

export default SalonDashboardSalon;