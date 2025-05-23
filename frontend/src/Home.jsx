import styles from "./style";
import {Business, CTA, Footer, Navbar, Stats, Hero } from "./components";
import { navLinks } from "./constants";
import { Link } from "react-router-dom"; // Dodajemo Link

const App = () => (
  <div className="bg-primary w-full overflow-hidden">
    <div className={`${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Navbar navList={navLinks}/>
      </div>
    </div>

    <div className={`bg-primary ${styles.flexStart}`}>
      <div className={`${styles.boxWidth}`}>
        <Hero />
      </div>
    </div>
    
    <div className={`bg-primary ${styles.paddingX} ${styles.flexCenter}`}>
      <div className={`${styles.boxWidth}`}>
        <Stats />
        <Business />
        <CTA /> 
        <Footer />
      </div>
    </div>
  </div>
);

export default App;
