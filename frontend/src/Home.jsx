import styles from "./style";
import {Business, CTA, Footer, Navbar, Stats, Hero } from "./components";
import { navLinks } from "./constants";

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
        <div className="bg-secondary h-[600px] flex items-center"> {/*privremeno */}
          <p  className="text-slate-300 text-4xl font-poppins">OSTALO</p>
        </div>
        {/*<Billing />
        <CardDeal />
        <Testimonials />
        <Clients />*/}
        <CTA /> 
        <Footer />
      </div>
    </div>
  </div>
);

export default App;
