import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return next(createError(403, "Token is not valid!"));
    req.user = user;
    next();
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
  const token = req.cookies.access_token;
  if (!token) {
    return next(createError(401, "You are not authenticated!"));
  }

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) {
      return next(createError(403, "Token is not valid!", { details: err.message }));
    }

    if (!user.isAdmin) {
      return next(createError(403, "You are not authorized!"));
    }

    req.user = user;
    next();
  });
};


export const verifyWorker = (req, res, next) => {
  verifyToken(req, res, (err) => {
    if (err) {
      return next(err);
    }

    const user = req.user;

    // Provjeravamo je li korisnik radnik u nekom salonu ili administrator

    if (user.isAdmin || (user.salons && user.salons.includes(req.body.salons))) {
      next();
    } else {
      return next(createError(403, "You are not authorized!"));
    }
  });
};