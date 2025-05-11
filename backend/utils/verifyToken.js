import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import { getUser, getUserInfo } from "../controllers/user.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  //console.log(token)
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    //console.log(user)
    next();
  });
};

export const checkToken = (req, res, next) => {
  ///TODO privremeno se koristi za frontendu jer je ovo zapravo verifyToken ali sa responsom
  const token = req.cookies.access_token;
  //console.log("Received token:", token);

  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      console.error("Error verifying token:", err);
      return next(createError(403, "Token is not valid!"));
    }
    //console.log("Token verified. User:", user);

    // Dodajte podatke o korisniku u odgovor
    const responseData = {
      user: {
        id: user.id,
        isAdmin: user.isAdmin,
        // Dodajte druge podatke koje želite poslati na frontend
      },
    };

    // Pošaljite odgovor s podacima o korisniku
    res
      .cookie("access_token", token, {
        httpOnly: true,
        path: "/", // COOKIE VRIJEDI NA CIJELOM SITEU
      })
      .status(200)
      .json(responseData);
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  // Pozivamo verifyToken funkciju da provjerimo token i postavimo req.user
  verifyToken(req, res, (error) => {
    if (error) {
      // Ako verifyToken vrati grešku, proslijedimo je dalje
      return next(error);
    }
    //console.log(req.user)
    // Provjeravamo je li korisnik administrator
    if (!req.user.isAdmin) {
      return next(createError(403, "You are not authorized!"));
    }

    // Ako je sve u redu, prelazi na sljedeći middleware
    next();
  });
};

export const verifyWorker = (req, res, next) => {
  verifyToken(req, res, async (err) => {
    if (err) {
      return next(err);
    }

    try {
      const user = req.user;
      console.log(user);
      console.log(req.params.id); // ID SALONA
      

      // Pozovite funkciju getUser kako biste dobili dodatne informacije o korisniku
      const userDetails = await getUserInfo(user.id);
      console.log(userDetails); // Ovdje možete iskoristiti detaljne informacije o korisniku
      console.log("userDetails._id " +userDetails._id)
      console.log(" userDetails.salons "+ userDetails.salons)
      console.log("salon id "+ req.params.id)

      // Provjerite je li korisnik administrator ili radnik u salonu
      if (
        userDetails.isAdmin ||
        (userDetails.salons  )//TODO && userDetails.salons.includes(req.params.id)
      ) {
        next();
      } else {
        console.log("nije worker");
        return res.status(403).json({ message: "You are not authorized!" });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
};

