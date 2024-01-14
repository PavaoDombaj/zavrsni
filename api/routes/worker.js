
import express from "express";
import {
    createWorker,
    updateWorker,
    deleteWorker,
    getWorker,
    getWorkers,
} from "../controllers/worker.js";
import { verifyToken, verifyUser, verifyAdmin, verifyWorker } from "../utils/verifyToken.js";



const router = express.Router();

// CREATE (GIVE PERMISION)
router.put("/", verifyWorker, createWorker);

// UPDATE
router.put("/:id", verifyUser, updateWorker);

// DELETE
router.delete("/:id",  verifyUser,deleteWorker);

// GET
router.get("/:id", verifyUser, getWorker);

// GET ALL
router.get("/",verifyAdmin, getWorkers);

export default router