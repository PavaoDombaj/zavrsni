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
} from "../controllers/reservation.js";
import { verifyAdmin, verifyUser, verifyWorker } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyUser, createReservation);

// UPDATE
/*router.put("/:id", verifyUser, updateReservation);

// DELETE
router.delete("/:id", verifyUser, deleteReservation);

// GET
router.get("/:id", getReservation);

// GET ALL
router.get("/", getReservations); */

//get available time for specific date of salon
router.get("/:workerId/:date", getAvailableTimes)

export default router;
