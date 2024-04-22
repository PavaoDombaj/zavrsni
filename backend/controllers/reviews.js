import Review from "../models/Reviews.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Reservation from "../models/Reservation.js";

export const createReview = async (req, res, next) => {
  try {
    // Dohvaćanje potrebnih podataka iz zahtjeva
    const userId = req.user.id;
    const salonId = req.params.id; // Salon ID iz URL parametra
    const { reservationId, rating } = req.body;

    // Provjera postoji li već recenzija za rezervaciju
    const existingReview = await Review.findOne({ reservationId });

    if (existingReview) {
      // Ako postoji već recenzija, ažuriraj ocjenu
      existingReview.rating = rating;
      await existingReview.save();

      res.status(200).json({ message: "Recenzija je uspješno ažurirana." });
    } else {
      // Ako ne postoji recenzija, stvori novu
      const newReview = new Review({
        userId,
        reservationId,
        salonId,
        rating,
      });

      await newReview.save();

      res.status(201).json({ message: "Recenzija je uspješno stvorena." });
    }
  } catch (error) {
    console.error("Greška prilikom stvaranja recenzije:", error);
    res
      .status(500)
      .json({ error: "Došlo je do greške prilikom stvaranja recenzije." });
  }
};

export const updateSalonRating = async (req, res, next) => {
  try {
    console.log(req.user);
    console.log("Primljeni podaci:", req.body);
  } catch {}
};
