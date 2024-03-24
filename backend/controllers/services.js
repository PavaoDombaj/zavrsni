import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Salon from "../models/Salon.js";
import Service from "../models/Services.js"
import { verifyToken, verifyUser } from "../utils/verifyToken.js";
import { createError } from "../utils/error.js";

export const createService = async (req, res, next) => {
  try {
    // Provjerite je li ID korisnika postavljen u req.user
    if (!req.user || !req.user.id) {
      return next(createError(401, "User ID not found!"));
    }
    console.log("User ID:", req.user.id);

    // Dohvatite postojećeg korisnika iz baze podataka prema ID-u korisnika
    const existingUser = await User.findById(req.user.id);

    const worker = await Worker.findById(req.user.id);
    if (worker) {
      const SalonId = await Salon.findOne({ workers: worker });
      const newService = new Service({
        name: req.body.name,
        description: req.body.description,
        durationMinutes: req.body.durationMinutes,
        price: req.body.price,
        SalonId: SalonId,
      });
      await newService.save(); // Spremite novu uslugu
      res.status(201).json(newService); // Vratite novostvorenu uslugu
    } else {
      console.log("Is Admin:", req.user.isAdmin);
      if (existingUser.isAdmin) {
        const newService = new Service({
          name: req.body.name,
          description: req.body.description,
          durationMinutes: req.body.durationMinutes,
          price: req.body.price,
          SalonId: req.body.salon,
        });
        await newService.save(); // Spremite novu uslugu
        res.status(201).json(newService); // Vratite novostvorenu uslugu
      } else {
        return createError(401, "You are not admin or worker in salon");
      }
    }
  } catch (err) {
    next(err);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const Service = await Service.findById(req.params.id);

    if (!Service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const updatedService= await Service.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedService);
  } catch (err) {
    next(err);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
  
    res.status(200).json("Service has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getService = async (req, res, next) => {
  try {
    const Service = await Service.findById(req.params.id);
    res.status(200).json(Service);
  } catch (err) {
    next(err);
  }
};

export const getServices = async (req, res, next) => {
  try {
    const Services = await Service.find();
    res.status(200).json(Services);
  } catch (err) {
    next(err);
  }
};
export const getServicesBySalon = async (req, res, next) => {
  const salonId = req.params.id; // Dohvatite ID salona iz parametara rute
  try {
    const services = await Service.find({ SalonId: salonId }); // Dohvatite usluge samo za odabrani salon
    res.status(200).json(services);
  } catch (err) {
    next(err);
  }
};

