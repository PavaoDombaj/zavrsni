import express from "express";
import Salon from "../models/Salon.js";
import { createError } from "../utils/error.js";

import {
  createSalon,
  updateSalon,
  deleteSalon,
  getSalon,
  getSalons,
} from "../controllers/salon.js";
import { verifyAdmin, verifyWorker } from "../utils/verifyToken.js";

const router = express.Router();

// CREATE
router.post("/", verifyAdmin, createSalon);

// UPDATE
router.put("/:id", verifyWorker, updateSalon);

// DELETE
router.delete("/:id", verifyAdmin, deleteSalon);

// GET
router.get("/:id", getSalon);

// GET ALL
router.get("/", getSalons);

export default router;
