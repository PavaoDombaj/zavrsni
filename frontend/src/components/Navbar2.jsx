import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // Dodajemo Link
import { close, logo, menu } from "../assets";

const Navbar2 = () => {
  const [active, setActive] = useState("Home");
  const [toggle, setToggle] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/auth/checkToken", {
          withCredentials: true,
        });

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

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8800/api/auth/logout", null, {
        withCredentials: true,
      });

      // Očisti korisničke podatke iz stanja nakon odjave
      setUser(null);

      // Osvježi stranicu kako bi se primijenile promjene
      window.location.reload();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinks = [
    { id: 1, title: "Partneri", path: "/" },
    { id: 2, title: "Home", path: "/clients" },
    user ? { id: 3, title: "Profil", path: "/clients/profile" } : { id: 3, title: "Prijavi se", path: "/clients/login" },
    !user ? { id: 4, title: "Registracija", path: "/clients/register" } : { id: 4, title: "Odjavi se", onClick: handleLogout },
    user ? { id: 5, title: "Moje rezervacije", path: "/clients/reservations" } : null,
  ].filter((nav) => nav);

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <Link to="/">
      <img src={logo} alt="BOOKLY" className="w-[auto] h-[80px]" />
    </Link>

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
            {/* Koristimo Link komponentu umjesto a elementa */}
            <Link to={nav.path} onClick={nav.onClick}>{nav.title}</Link>
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
                {/* Koristimo Link komponentu umjesto a elementa */}
                <Link to={nav.path} onClick={nav.onClick}>{nav.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar2;
