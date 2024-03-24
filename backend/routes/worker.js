
import express from "express";
import {
    createWorker,
    updateWorker,
    deleteWorker,
    getWorker,
    getWorkers,
    getWorkersBySalon
} from "../controllers/worker.js";
import { verifyToken, verifyUser, verifyAdmin, verifyWorker } from "../utils/verifyToken.js";



const router = express.Router();

// CREATE (GIVE PERMISION)
router.put("/", verifyAdmin, createWorker);

// UPDATE
router.put("/:id", verifyUser, updateWorker);

// DELETE
router.delete("/:id", verifyAdmin, deleteWorker);

// GET
router.get("/:id", getWorker);

// GET ALL
router.get("/", getWorkers);

router.get("/salon/:id", getWorkersBySalon);

export default router