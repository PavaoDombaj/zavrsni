import React from "react";
import styles from "./style";
import {
  Navbar,
  Featured,
} from "./components";
import "./index.css";

const Clients = () => {
  return (
    <div className="bg-primary w-full overflow-hidden">
      
      <div className={`${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      {/*<div className={`bg-primary ${styles.flexStart} `}>
        <div className={`${styles.boxWidth} `}>
          <div>
            <p
              className={` ${styles.flexCenter } text-white text-2xl font-bold mt-[100px] mb-10`}
            >
              PRONADI SALON
            </p>
            <SearchBar />
          </div>
        </div>
  </div>*/}
      <div className={`bg-primary ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Featured />
        </div>
      </div>
    </div>
  );
};

export default Clients;
