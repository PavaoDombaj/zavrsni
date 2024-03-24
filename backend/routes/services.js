
import express from "express";
import {
    createService,
    updateService,
    deleteService,
    getService,
    getServices,
    getServicesBySalon,
} from "../controllers/services.js";
import { verifyToken, verifyUser, verifyAdmin, verifyWorker } from "../utils/verifyToken.js";



const router = express.Router();

// CREATE (GIVE PERMISION)
router.put("/", verifyUser, createService);

// UPDATE
router.put("/:id", verifyUser, updateService);

// DELETE
router.delete("/:id", verifyAdmin, deleteService);

// GET
router.get("/:id", getService);

// GET ALL
router.get("/",  getServices);

//GET SERVICE BY SALON
router.get("/salon/:id", getServicesBySalon);

export default router