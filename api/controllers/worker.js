import User from "../models/User.js";
import Worker from "../models/Worker.js";

export const createWorker = async (req, res, next) => {
    try {
        // Dohvati postojećeg korisnika iz baze podataka prema ID-u korisnika

        //console.log("Trazim korisnika s ID:", req.body.user)
        const existingUser = await User.findById(req.body.user); //req.body.user == id 
        //console.log("existingUser ID:", existingUser._id)
    

        if (!existingUser) {
            // Ako korisnik s tim ID-om ne postoji, vrati odgovarajući odgovor
            return res.status(404).json({ message: "User not found" });
        }

        const existingWorker = await Worker.findById(req.body.user)
        if(existingWorker){
            return res.status(400).json({message:"Korsnik vec radi u nekom salonu!"})
        }

        // Stvori novog radnika s istim ID-om korisnika
        const newWorker = new Worker({
            name: req.body.name,
            role: req.body.role,
            user: existingUser._id,
            _id: existingUser._id, // Postavi user polje na ID postojećeg korisnika
            salons: [],
            workSchedules: [],
        });

        // Spremi novog radnika u bazu podataka
        const savedWorker = await newWorker.save();

        res.status(200).json(savedWorker);
    } catch (err) {
        next(err);
    }
};




export const updateWorker = async (req, res, next) => {
    try {
        const updatedWorker = await Worker.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedWorker);
    } catch (err) {
        next(err)
    }
}


export const deleteWorker = async (req, res, next) => {
    try {
        const deletedWorker = await Worker.findByIdAndDelete(req.params.id);
        res.status(200).json("Worker has been deleted!");
    } catch (err) {
        next(err)
    }
}
export const getWorker = async (req, res, next) => {
    try {
        const worker = await Worker.findById(req.params.id);
        res.status(200).json(worker);
    } catch (err) {
        next(err)
    }
}


export const getWorkers = async (req, res, next) => {
    try {
        const Workers = await Worker.find();
        res.status(200).json(Workers);
    } catch (err) {
        next(err)
    }
}

