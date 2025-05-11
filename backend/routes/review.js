import express from "express";
import Reservation from "../models/Reservation.js";
import Reviews from "../models/Reviews.js";
import { createError } from "../utils/error.js";

import { createReview} from "../controllers/reviews.js";
import {
  verifyAdmin,
  verifyUser,
  verifyWorker,
  verifyToken,
} from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/:id", verifyToken, createReview);

export default router;
