import React from "react";
import { Link, useParams } from "react-router-dom";

const NavbarReserve = ({ salonName, step }) => {
  const { id } = useParams();
  let stepText;

  switch (step) {
    case 1:
      stepText = "Odabir usluge";
      break;
    case 2:
      stepText = "Biranje vremena";
      break;
    case 3:
      stepText = "Potvrda termina";
      break;
    default:
      stepText = "Nepoznat korak";
  }

  return (
    <div className="flex items-center justify-between bg-gray-800 text-white py-4 px-6 w-full font-poppins">
      <div>{salonName}</div>
      <div className="ml-4">
        {`Korak ${step}/3: `}
        <span className="mr-32">{stepText}</span>
        <Link to={`/clients/salon/${id}`} className="underline">
          X
        </Link>
      </div>
    </div>
  );
};

export default NavbarReserve;
