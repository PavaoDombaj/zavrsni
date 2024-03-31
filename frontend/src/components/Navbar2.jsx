import { close, logo, menu } from "../assets";
import { navLinks } from "../constants";

import { useState, useEffect } from "react";
import axios from "axios";

const Navbar2 = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
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


  const navLinks = [
    { id: 1, title: "Partneri", path: "/" },
    { id: 2, title: "Home",},
    user
      ? { id: 3, title: "Profil", path: "/clients/profile" } // Dodajte profilnu stranicu ako je korisnik prijavljen
      : { id: 3, title: "Prijavi se", path: "/clients/login" },
    !user ? { id: 4, title: "Registracija", path: "/clients/register" } : { id: 4, title: "Odjavi se" }, // TODO ODJAVI SE Dodajte registraciju ako korisnik nije prijavljen
    user ? { id: 5, title: "Moje rezervacije", path: "/clients/reservations"} : null , 
  ].filter((nav) => nav); // Filtrirajte null vrijednosti


  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="BOOKLY" className="w-[auto] h-[80px]" />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navLinks.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[18px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"} ${
              index === 0 ? "text-fuchsia-600" : ""
            }`}
            onClick={() => setActive(nav.title)}
          >
            <a href={nav.path ? nav.path : `#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          src={toggle ? close : menu}
          alt="menu"
          className="w-[28px] h-[28px] object-contain"
          onClick={() => setToggle(!toggle)}
        />

        <div
          className={`${
            !toggle ? "hidden" : "flex"
          } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
        >
          <ul className="list-none flex justify-end items-start flex-1 flex-col">
            {navLinks.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
                onClick={() => setActive(nav.title)}
              >
                <a href={nav.path ? nav.path : `#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;