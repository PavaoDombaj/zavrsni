import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faHome, faStore, faUsers, faTable, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import SalonDashboardSalon from "./SalonDashboardSalon";
const SalonDashboard = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("Main"); // Stanje koje prati trenutno odabrani element izbornika

  // Funkcija za promjenu odabranog elementa izbornika
  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  // Funkcija za renderiranje odgovarajućeg sadržaja na temelju odabranog elementa izbornika
  const renderContent = () => {
    switch (selectedMenuItem) {
      case "Main":
        return (
          <div>
            {/* Main content za odabrani Main izbornik */}
          </div>
        );
      case "Salon":
        return (
          <SalonDashboardSalon/>
        );
      case "Users":
        return (
          <div>
            {/* Main content za odabrani Users izbornik */}
          </div>
        );
      case "Reservations":
        return (
          <div>
            {/* Main content za odabrani Reservations izbornik */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left navigation */}
      <nav className="bg-gray-800 w-48 py-6 px-4 flex flex-col items-center sticky top-0 h-screen">
        <div className="flex flex-col items-center space-y-4">
          {[
            { icon: faHome, text: "Main" },
            { icon: faStore, text: "Salon" },
            { icon: faUsers, text: "Users" },
            { icon: faTable, text: "Reservations" },
          ].map((item, index) => (
            <div
              key={index}
              onClick={() => handleMenuItemClick(item.text)} // Poziv funkcije za promjenu odabranog elementa izbornika na klik
              className={`text-white text-lg flex items-center space-x-2 cursor-pointer ${selectedMenuItem === item.text ? 'bg-gray-700' : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-grow bg-gray-100">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white py-4 px-6 flex justify-between items-center ">
          <div className="text-xl font-bold">Bookly Dashboard</div>
          <div className="flex">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 mr-4 bg-gray-700 rounded-lg"
            />
            <button className="px-3 py-1 bg-gray-700 rounded-lg">
              <FontAwesomeIcon icon={faSearch} />
            </button>
          </div>
          <div>
            <FontAwesomeIcon icon={faUser} />
          </div>
        </nav>
        
        {/* Main dashboard content */}
        <div className="bg-gray-900 rounded-[20px] h-full p-8">
          {/* Renderiranje odgovarajućeg sadržaja */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SalonDashboard;
