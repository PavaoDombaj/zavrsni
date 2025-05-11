import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./style";
import Navbar2 from "./components/Navbar2";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useParams, Link } from "react-router-dom";

const SalonPage = () => {
  const { id } = useParams();
  const [salonData, setSalonData] = useState(null);

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

  if (!salonData) {
    // Loading state
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar2 />
          <hr />
        </div>
      </div>
      <div className={`bg-primary ${styles.flexStart}`}>
        {/* Prvi div */}
        <div
          className={`${styles.boxWidth} mt-10 bg-white rounded-[20px] flex flex-col sm:flex-row`}
        >
          {/* Image */}
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <img
              src={salonData.images[0]}
              className="rounded-tl-lg w-full h-auto sm:w-[700px] object-cover"
              alt="Salon Image"
            />
          </div>
          {/* Name, location, and button */}
          <div className="flex-1 mx-auto my-auto items-center justify-items-center text-center">
            <h2 className={`${styles.heading2} text-black`}>
              {salonData.name}
            </h2>
            <p
              className={`font-poppins font-normal text-[18px] leading-[30.8px] 
                text-gray-800 mt-2`}
            >
              {salonData.location.city}, {salonData.location.address}
            </p>
            <Link
              to={`/clients/salon/${id}/reserve`}
              className="btn inline-flex items-center justify-center px-4 py-2 mt-5 text-s font-semibold 
        tracking-widest text-white uppercase transition duration-150 ease-in-out
        bg-gray-900 border border-transparent rounded-md active:bg-gray-900"
            >
              Rezerviraj termin
            </Link>
          </div>
        </div>
      </div>
      <div className={`bg-primary ${styles.flexStart}`}>
        {/* Drugi div */}
        <div className={`${styles.boxWidth} mt-5  flex flex-row`}>
          {/* lijeva strana sa deskripcijom */}
          <div className="flex-inline bg-white rounded-[10px] w-3/5 p-3">
            <p
              className={` font-poppins font-bold text-[25px] leading-[30.8px] 
             text-gray-800 mt-2`}
            >
              O {salonData.name}
            </p>
            <p
              className={`font-poppins font-normal text-[18px] leading-[30.8px] 
               text-gray-800 mt-4`}
            >
              {" "}
              {salonData.description}{" "}
            </p>
          </div>

          {/* Desna strana sa radnim vremenom */}
          <div className="ml-5  p-3 flex-1 bg-white rounded-[10px]">
            <p
              className={`font-poppins font-bold text-[25px] leading-[30.8px] 
             text-gray-800 mt-2`}
            >
              Radno vrijeme
            </p>
            {Object.keys(salonData.workingHours).map((day) => (
              <div className="flex flex-inline mb-1" key={day}>
                <p className="font-poppins font-bold">
                  {salonData.workingHours[day].day}{" "}
                </p>
                <p>: {salonData.workingHours[day].startTime} </p>
                <p> - {salonData.workingHours[day].endTime}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalonPage;
