import Salon from "../models/Salon.js"
import User from "../models/User.js";

export const createSalon = async (req, res, next) => {
    try {
        const existingUser = await User.findById(req.body.owner.ownerId);
        console.log("existingUser ID:", req.body.owner.ownerId)


        if (!existingUser) {
            // Ako korisnik s tim ID-om ne postoji, vrati odgovarajući odgovor
            return res.status(404).json({ message: "User not found" });
        }
        const newSalon = new Salon({
            name:req.body.name,
            owner: {
                username: existingUser.username,
                name: req.body.owner.name,
                ownerId: existingUser._id,
            },
            location: req.body.location,
            images: req.body.images,
            description: req.body.description,
            services: [], 
            workers: [],
            _id: existingUser._id, // Postavi user polje na ID postojećeg korisnika
            rating: 0, // Možete postaviti početnu ocjenu prema potrebi
        });

        // Spremi novog radnika u bazu podataka
        const savedWorker = await newWorker.save();

        res.status(200).json(savedWorker);
    } catch (err) {
        next(err)
    }
}

export const updateSalon = async (req, res, next) => {
    try {
        const updatedSalon = await Salon.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updatedSalon);
    } catch (err) {
        next(err)
    }
}


export const deleteSalon = async (req, res, next) => {
    try {
        const deletedSalon = await Salon.findByIdAndDelete(req.params.id);
        res.status(200).json("Salon has been deleted!");
    } catch (err) {
        next(err)
    }
}
export const getSalon = async (req, res, next) => {
    try {
        const salon = await Salon.findById(req.params.id);
        res.status(200).json(salon);
    } catch (err) {
        next(err)
    }
}


export const getSalons = async (req, res, next) => {
    try {
        const salons = await Salon.find();
        res.status(200).json(salons);
    } catch (err) {
        next(err)
    }
}

