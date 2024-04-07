import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../style";
import Navbar2 from "./Navbar2";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import SignBlocks from "./SignBlocks";

const Card = ({ salonData }) => {
  const imageUrl =
    salonData.images.length > 0
      ? salonData.images[0]
      : "https://salonlfc.com/wp-content/uploads/2018/01/image-not-found-scaled.png";

  // Logirajte sliku u konzolu
  useEffect(() => {
    //console.log("Učitana slika:", imageUrl);
  }, [imageUrl]);

  return (
    <div
      className={`max-w-md mx-auto mb-8 rounded-[15px] overflow-hidden shadow-lg bg-white`}
    >
      {imageUrl && (
        <Link to={`/clients/salon/${salonData._id}`}>
          <img
            className="w-full h-40 object-cover"
            src={imageUrl}
            alt={`Image of ${salonData.name}`}
          />
        </Link>
      )}
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{salonData.name}</div>
        <p className="text-gray-700 mb-2">
          Location: {salonData.location.city}
        </p>
        <div className="flex items-center">
          <span className="text-gray-600">Rating: </span>
          <span className="ml-1 text-gray-900 font-bold">
            {salonData.rating}
          </span>{" "}
          <span className="text-gray-900">/5 </span>
        </div>
      </div>
    </div>
  );
};

const Featured = () => {
  const [topSalons, setTopSalons] = useState([]);
  const [filteredSalons, setFilteredSalons] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8800/api/salons", {
          params: {
            sortBy: "-rating", // Sortiraj po ocjeni od najviše do najniže
            limit: 3, // uzmi samo 3 salona
          },
        });
  
        setTopSalons(response.data);
      } catch (error) {
        console.error("Error fetching top salons data:", error);
      }
    };
  
    fetchData();
  }, []);

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

  useEffect(() => {
    // Filtriranje salona na temelju unesenog teksta
    const filtered = topSalons.filter((salon) =>
      salon.name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredSalons(filtered);
  }, [searchText, topSalons]);
  

  return (
    <div className="bg-primary w-full overflow-hidden">
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar2 />
          <hr />
          <SignBlocks></SignBlocks>
        </div>
      </div>
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth} mt-10`}>
          <h2 className={`${styles.heading2} text-center`}>POPULARNI SALONI</h2>
          {/* Pretraživač salona */}
          <input
            type="text"
            placeholder="Pretraži salone..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="block w-full p-2 border border-gray-300 rounded-md mb-6"
          />
          <div
            id="home"
            className={`grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center ${styles.paddingY}`}
          >
            {filteredSalons.map((salon) => (
              <Card key={salon._id} salonData={salon} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
