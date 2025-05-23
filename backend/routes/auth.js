
import express from "express";
import { logout, register } from "../controllers/auth.js";
import { login } from "../controllers/auth.js";
import {verifyToken, checkToken} from "../utils/verifyToken.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/checkToken", checkToken) /// TODO privremeno se koristi za frontendu jer je ovo zapravo verifyToken ali sa responsom

router.post("/logout", logout)
export default router;
