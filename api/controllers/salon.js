import Salon from "../models/Salon.js"


export const createSalon = async(req,res,next)=>{
    const newSalon = new Salon(req.body);

    try {
        const savedSalon = await newSalon.save();
        res.status(200).json(savedSalon);
    } catch (err) {
        next(err)
    }
}

export const updateSalon = async(req,res,next)=>{
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


export const deleteSalon = async(req,res,next)=>{
    try {
        const deletedSalon = await Salon.findByIdAndDelete(req.params.id);
        res.status(200).json("Salon has been deleted!");
    } catch (err) {
        next(err)
    }
}
export const getSalon = async(req,res,next)=>{
    try {
        const salon = await Salon.findById(req.params.id);
        res.status(200).json(salon);
    } catch (err) {
        next(err)
    }
}


export const getSalons = async(req,res,next)=>{
    try {
        const salons = await Salon.find();
        res.status(200).json(salons);
    } catch (err) {
        next(err)
    }
}

