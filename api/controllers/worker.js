import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Salon from "../models/Salon.js";

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

        const newWorkerSalon = await Salon.findById(req.body.salon)
        // Stvori novog radnika s istim ID-om korisnika
        const newWorker = new Worker({
            name: req.body.name,
            role: req.body.role,
            user: existingUser._id,
            _id: existingUser._id, // Postavi user polje na ID postojećeg korisnika
            salons: newWorkerSalon,
            workSchedules: [],
        });
        // Ažuriraj polje salons u tablici User
        existingUser.salons.push(newWorkerSalon._id); ///existing user = id korisnika kod kojege se u salons.   
        //pusha vrijednost njegovog salona u kojem radi
        await existingUser.save();

        /// Ažuriraj polje workers u tablici Salon
        newWorkerSalon.workers.push(existingUser._id)
        await newWorkerSalon.save();

        console.log("newWorkerSalon._id: " + newWorkerSalon._id); //test

        // Spremi novog radnika u bazu podataka
        const savedWorker = await newWorker.save();

        res.status(200).json(savedWorker);
    } catch (err) {
        next(err);
    }
};




export const updateWorker = async (req, res, next) => {
    try {
        // Dohvati workera prije ažuriranja
        const worker = await Worker.findById(req.params.id);

        if (!worker) {
            return res.status(404).json({ message: "Worker not found" });
        }

        // Dohvati salon prije promjene od traženog workera
        const oldSalon = await Salon.findById(worker.salons);

        const updatedWorker = await Worker.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        if (oldSalon !== null && oldSalon._id.toString() !== req.params.salons) {
            // Ako je oldSalon pronađen i ID starog salona nije jednak ID-u novog salona
            const newWorkersSalonId = req.params.salons;

            // Ukloni workera iz podataka workers njegovog starog salona
            const indexToRemove = oldSalon.workers.indexOf(worker._id);
            if (indexToRemove !== -1) {
                oldSalon.workers.splice(indexToRemove, 1);
                await oldSalon.save();
            }

            // Dodaj workera u podatke workers njegovog novog salona
            const newSalon = await Salon.findById(newWorkersSalonId);
            if (newSalon) {
                newSalon.workers.push(worker._id);
                await newSalon.save();
            } else {
                console.log("New salon not found"); // Ovdje možete dodati dodatne radnje prema potrebi
            }
        }

        res.status(200).json(updatedWorker);
    } catch (err) {
        next(err);
    }
};


export const deleteWorker = async (req, res, next) => {
    try {
        const deletedWorker = await Worker.findByIdAndDelete(req.params.id);

        // Ukloni workera iz polja salons u tablici User
        await User.updateMany(
            { salons: req.params.id },
            { $pull: { salons: req.params.id } }
        );

        // Ukloni workera iz polja workers u tablici Salon
        await Salon.updateMany(
            { workers: req.params.id },
            { $pull: { workers: req.params.id } }
        );

        res.status(200).json("Worker has been deleted!");
    } catch (err) {
        next(err);
    }
};


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

