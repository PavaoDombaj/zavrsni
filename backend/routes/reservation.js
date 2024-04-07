import express from "express";
import Reservation from "../models/Reservation.js";
import { createError } from "../utils/error.js";

import {
  createReservation,
  updateReservation,
  deleteReservation,
  getReservation,
  getReservations,
  getAvailableTimes,
  getUserReservations,
  getWorkerReservations,
} from "../controllers/reservation.js";
import { verifyAdmin, verifyUser, verifyWorker, verifyToken } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/",createReservation);

// UPDATE
/*router.put("/:id", verifyUser, updateReservation);



// GET
router.get("/:id", getReservation);

// GET ALL
router.get("/", getReservations); */

// UPDATE
router.put("/:id", updateReservation); //TO DO dodaj provjeru

// DELETE
router.delete("/:id", verifyToken, deleteReservation);

//get available time for specific date of salon
router.get("/:workerId/:date", getAvailableTimes)


//get users reservations
router.get("/reservations/user/:userId",  getUserReservations);


//get workers reservations
router.get("/reservations/worker/:workerId",  getWorkerReservations);

export default router;
