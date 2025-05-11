import styles from "../style";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import React, { useState, useEffect } from "react";
import axios from "axios";

const SignBlocks = () => {
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(["access_token"]);

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

  return (
    <div
      className={`${styles.flexCenter} mt-4 grid grid-cols-1 md:grid-cols-2 gap-6`}
    >
      {/* Registracija i prijava blokovi */}
      {!user && (
        <>
          <Link to="/clients/register">
            <div
              className={`${styles.marginX} bg-neutral-200 p-5 rounded-[10px] hover:bg-neutral-300 transition cursor-pointer flex flex-col justify-between`}
            >
              {/* Registracija blok */}
              <div className="flex-grow">
                <h2
                  className={`${styles.heading2} mb-3 text-center text-slate-800`}
                >
                  Registracija
                </h2>
                <p className={`font-poppins font-normaltext-[18px] leading-[30.8px] text-center text-slate-700`}>
                  Nemate profil? Registrirajte se!
                </p>
              </div>
            </div>
          </Link>

          <Link to="/clients/login">
            <div
              className={`${styles.marginX} bg-neutral-200 p-5 rounded-[10px] hover:bg-neutral-300 transition cursor-pointer flex flex-col justify-between`}
            >
              <div className="flex-grow">
                <h2
                  className={`${styles.heading2} mb-3 text-center text-slate-800`}
                >
                  Prijava
                </h2>
                <p className={`font-poppins font-normaltext-[18px] leading-[30.8px] text-center text-slate-700`}>
                  Prijavite se i pratite na jednom <br />
                  mjestu status Vaših rezervacija
                </p>
              </div>
            </div>
          </Link>
        </>
      )}
    </div>
  );
};

export default SignBlocks;
