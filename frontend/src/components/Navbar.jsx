import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { close, logo, menu } from "../assets";
import { navLinks, navLinksClients } from "../constants";

const Navbar = ({ navList }) => {
  const [active, setActive] = useState(navList[0].title);
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (nav) => {
    setActive(nav.title);
    const destination = nav.do === "route" ? `/${nav.id}` : `#${nav.id}`;
    if (!nav.disabled) {
      navigate(destination);
    }
  };

  return (
    <nav className="w-full flex py-6 justify-between items-center navbar">
      <img src={logo} alt="BOOKLY" className="w-[auto] h-[80px] " />

      <ul className="list-none sm:flex hidden justify-end items-center flex-1">
        {navList.map((nav, index) => (
          <li
            key={nav.id}
            className={`font-poppins font-normal cursor-pointer text-[18px] ${
              active === nav.title ? "text-white" : "text-dimWhite"
            } ${index === navList.length - 1 ? "mr-0" : "mr-10"} ${
              nav.color || ""
            } ${nav.disabled ? "opacity-50 pointer-events-none" : ""}`}
            onClick={() => handleNavigation(nav)}
          >
            <a to={nav.do === "route" ? `/${nav.id}` : `#${nav.id}`}>
              {nav.title}
            </a>
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
            {navList.map((nav, index) => (
              <li
                key={nav.id}
                className={`font-poppins font-medium cursor-pointer text-[16px] ${
                  active === nav.title ? "text-white" : "text-dimWhite"
                } ${index === navList.length - 1 ? "mb-0" : "mb-4"} ${
                  nav.color || ""
                } ${nav.disabled ? "opacity-50 pointer-events-none" : ""}`}
                onClick={() => handleNavigation(nav)}
              >
                <a to={nav.do === "route" ? `/${nav.id}` : `#${nav.id}`}>
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
