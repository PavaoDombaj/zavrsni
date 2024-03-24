import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SuccessfulLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Postavi timeout na 5 sekundi
    const timeoutId = setTimeout(() => {
      // Nakon 5 sekundi, preusmjeri korisnika na željenu stranicu
      navigate.push("/clients");
    }, 5000);
    console.log("Succ")

    // Očisti timeout kad se komponenta odmontira (npr. kad korisnik napusti stranicu)
    return () => clearTimeout(timeoutId);
  }, [navigate]); // Dodaj history kao zavisnost kako bi se osiguralo da se useEffect ponovno pokrene kad se promijeni

  return (
    <div>
      <p>Uspješno ste se prijavili!</p>
      <p>Bit ćete preusmjereni za 5 sekundi...</p>
      {/* Dodajte željeni sadržaj ili iskoristite ovo mjesto za poruke nakon uspješnog prijavljivanja */}
    </div>
  );
};

export default SuccessfulLogin;
