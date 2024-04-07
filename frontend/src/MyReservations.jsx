import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./style";
import Navbar2 from "./components/Navbar2";
import SignBlocks from "./components/SignBlocks";

const MyReservations = () => {
  const [userData, setUserData] = useState(null);
  const [userReservations, setUserReservations] = useState([]);
  const [userReservationsPast, setUserReservationsPast] = useState([]);
  const [cancelReservationId, setCancelReservationId] = useState(null);
  const [showPastReservation, setShowPastReservation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/auth/checkToken",
          { withCredentials: true }
        );

        const userId = response.data.user.id;

        const userResponse = await axios.get(
          `http://localhost:8800/api/users/${userId}`,
          { withCredentials: true }
        );

        setUserData(userResponse.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          setUserData(null);
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
        if (userData) {
          const userId = userData._id;
          console.log(userData);
          console.log(userId);
          const response = await axios.get(
            `http://localhost:8800/api/reservation/reservations/user/${userId}`
          );
          console.log("response ", response);

          // Dobivanje dodatnih informacija o salonima, radnicima i uslugama
          const reservationsWithDetails = await Promise.all(
            response.data.futureReservations.map(async (reservation) => {
              const salonResponse = await axios.get(
                `http://localhost:8800/api/salons/${reservation.salonId}`
              );
              const workerResponse = await axios.get(
                `http://localhost:8800/api/worker/${reservation.workerId}`
              );
              const serviceResponse = await axios.get(
                `http://localhost:8800/api/services/${reservation.serviceId}`
              );

              const salon = salonResponse.data;
              const worker = workerResponse.data;
              const service = serviceResponse.data;

              return {
                ...reservation,
                salon,
                worker,
                service,
              };
            })
          );

          setUserReservations(reservationsWithDetails);

          // Dobivanje dodatnih informacija o salonima, radnicima i uslugama
          const pastReservationsWithDetails = await Promise.all(
            response.data.pastReservations.map(async (reservation) => {
              const salonResponse = await axios.get(
                `http://localhost:8800/api/salons/${reservation.salonId}`
              );
              const workerResponse = await axios.get(
                `http://localhost:8800/api/worker/${reservation.workerId}`
              );
              const serviceResponse = await axios.get(
                `http://localhost:8800/api/services/${reservation.serviceId}`
              );

              const salon = salonResponse.data;
              const worker = workerResponse.data;
              const service = serviceResponse.data;

              return {
                ...reservation,
                salon,
                worker,
                service,
              };
            })
          );

          setUserReservationsPast(pastReservationsWithDetails);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [userData]);

  const handleCancelReservation = async () => {
    try {
      console.log(cancelReservationId);
      if (cancelReservationId) {
        // Implementacija brisanja rezervacije
        await axios.delete(
          `http://localhost:8800/api/reservation/${cancelReservationId}`,
          { withCredentials: true }
        );
        // Ažuriranje prikaza nakon brisanja
        setUserReservations(
          userReservations.filter(
            (reservation) => reservation._id !== cancelReservationId
          )
        );
        // Resetiranje ID-a za otkazivanje rezervacije
        setCancelReservationId(null);
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
    }
  };

  const handleShowPast = () => {
    setShowPastReservation(!showPastReservation);
  };

  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar2 />
          <hr />
          <SignBlocks />
        </div>
      </div>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth} mt-10`}>
          <button
            onClick={handleShowPast}
            className="btn p-2 bg-slate-200 rounded-xl font-bold font-poppins mb-2"
          >
            prikazi prosle rezervacije
          </button>

          {showPastReservation && (
            <div>
              <h2 className={`${styles.heading2} text-center`}>
                Past Reservations
              </h2>
              {userReservationsPast.map((reservation) => (
                <div
                  className="bg-gray-200 mb-5 p-4 rounded-lg"
                  key={reservation._id}
                >
                  <div className="flex items-center mb-2">
                    <img
                      src={reservation.salon.images[1]}
                      alt={reservation.salon.name}
                      className="w-16 h-16 mr-4"
                    />
                    <div>
                      <p className="font-poppins font-semibold">
                        {reservation.salon.name}
                      </p>
                      <p>
                        {reservation.salon.location.address},{" "}
                        {reservation.salon.location.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center mb-2">
                    <div>
                      <p className="mr-4 font-semibold">
                        {reservation.service.name} (
                        {reservation.durationMinutes} min)
                      </p>
                      <p className="mr-4 font-semibold">
                        Cijena: {reservation.service.price} €
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Radnik:</p>
                      <p>{reservation.worker.name}</p>
                    </div>
                    <div className="ml-5">
                      <p className="font-semibold">Vrijeme rezervacije</p>
                      <p className="bg-blue-400 p-2 rounded-xl">
                        {new Date(reservation.reservationTime).toLocaleString()}
                      </p>
                      {reservation.dosao && ( ///TODO dovrsi
                        <div>
                          {/* Render rating component here */}
                          {/* For example: */}
                          <select>
                            <option value="1">1 Star</option>
                            <option value="2">2 Stars</option>
                            <option value="3">3 Stars</option>
                            <option value="4">4 Stars</option>
                            <option value="5">5 Stars</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <h2 className={`${styles.heading2} text-center`}>Moje rezervacije</h2>

          {userReservations.map((reservation) => (
            <div className="bg-white mb-5 p-4 rounded-lg" key={reservation._id}>
              <div className="flex items-center mb-2">
                <img
                  src={reservation.salon.images[1]}
                  alt={reservation.salon.name}
                  className="w-16 h-16 mr-4"
                />{" "}
                {/* SLIKA SALONA */}
                <div>
                  <p className="font-poppins font-semibold">
                    {reservation.salon.name}
                  </p>{" "}
                  {/* IME SALONA */}
                  <p>
                    {reservation.salon.location.address},{" "}
                    {reservation.salon.location.city}
                  </p>{" "}
                  {/* LOKACIJA SALONA */}
                </div>
              </div>
              <div className="flex items-center mb-2">
                <div>
                  <p className="mr-4 font-semibold">
                    {reservation.service.name} ({reservation.durationMinutes}{" "}
                    min)
                  </p>{" "}
                  {/* NAZIV USLUGE I TRAJANJE */}
                  <p className="mr-4 font-semibold">
                    Cijena: {reservation.service.price}
                  </p>{" "}
                  {/* CIJENA */}
                </div>
                <div>
                  <p className="font-semibold">Radnik:</p>
                  <p>{reservation.worker.name}</p> {/* IME ZAPOSLENIKA */}
                </div>
                <div className="ml-5">
                  <p className="font-semibold">Vrijeme rezervacije</p>
                  <p className="bg-blue-400 p-2 rounded-xl">
                    {new Date(reservation.reservationTime).toLocaleString()}
                  </p>{" "}
                  {/* VRIJEME REZERVACIJE */}
                </div>
              </div>
              <div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setCancelReservationId(reservation._id)}
                >
                  Odustani
                </button>
                {cancelReservationId === reservation._id && (
                  <div className="bg-red-100 text-red-900 p-4 rounded-lg mt-2">
                    <p>Jeste li sigurni da želite otkazati ovu rezervaciju?</p>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
                      onClick={handleCancelReservation}
                    >
                      Da, otkaži
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg mt-2 ml-2"
                      onClick={() => setCancelReservationId(null)}
                    >
                      Odustani
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyReservations;
