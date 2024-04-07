
import express from "express";
import {
    updateUser,
    deleteUser,
    getUser,
    getUsers,
} from "../controllers/user.js";
import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";
import {deleteWorker} from "../controllers/worker.js"


const router = express.Router();
/*
router.get("/checkauthentication", verifyToken, (req, res, next)=>{
    res.send("Hello user,you are logged in!")
})

router.get("/checkuser/:id", verifyUser, (req, res, next)=>{
    res.send("Hello user,you are logged in and you can delete account!")
})

router.get("/checkadmin/:id", verifyAdmin, (req, res, next)=>{
    res.send("Hello admin,you are logged in and you can delete all accounts!")
})*/


// UPDATE
router.put("/:id",updateUser, verifyUser);

// DELETE
router.delete("/:id", verifyUser, deleteWorker, deleteUser);

// GET
router.get("/:id", getUser);/* TO DO Ako želite da se podaci dobiveni u 
funkciji getUser koriste kao odgovor, a ne podaci dobiveni u verifyToken, 
onda morate promijeniti redoslijed middlewareova u vašem putu. 
Stavite verifyUser nakon getUser kako bi se getUser izvršila prije i koristila svoj odgovor. Evo 
*/


// GET ALL
router.get("/",verifyAdmin, getUsers);

export default router