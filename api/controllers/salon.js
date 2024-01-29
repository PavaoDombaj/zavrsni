import Salon from "../models/Salon.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";

export const createSalon = async (req, res, next) => { //trebalo bi biti u fullu gotovo
  try {
    let existingUser;

    // Provjeri postoji li ownerId u owner objektu
    if (req.body.owner && req.body.owner.ownerId) {
      existingUser = await User.findById(req.body.owner.ownerId);
    } else {
      // Ako ownerId nije unesen, postavi vlasnika na usera koji je izvršio zahtjev
      existingUser = await User.findById(req.user._id);
    }

    // Provjeri postoji li korisnik s navedenim ID-om
    if (!existingUser) {
      // Ako korisnik s tim ID-om ne postoji, vrati odgovarajući odgovor
      return res.status(404).json({ message: "User not found" });
    }

    // Provjeri jedinstvenost imena salona
    const existingSalon = await Salon.findOne({ name: req.body.name });
    if (existingSalon) {
      // Ako salon s tim imenom već postoji, vrati odgovarajući odgovor
      return res
        .status(400)
        .json({ message: "Salon with this name already exists" });
    }

    // Ako korisnik nije admin, provjeri  vlasnik već nije vlasnik drugog salona
    if (!existingUser.isAdmin) {
      // Provjeri da vlasnik već nije vlasnik nekog drugog salona
      const existingOwnerSalon = await Salon.findOne({
        "owner.ownerId": existingUser._id,
      });
      if (existingOwnerSalon) {
        // Ako vlasnik već ima salon, vrati odgovarajući odgovor
        return res
          .status(400)
          .json({ message: "User is already an owner of another salon" });
      }
    }

    // Stvori novi salon
    const newSalon = new Salon({
      name: req.body.name,
      owner: {
        username: existingUser.username,
        name: req.body.owner.name,
        ownerId: existingUser._id,
      },
      location: req.body.location,
      images: req.body.images,
      description: req.body.description,
      services: [],
      workers: existingUser._id,
      rating: 0,
    });

    // Spremi novi salon u bazu podataka
    const savedSalon = await newSalon.save();

    // Stvori novog radnika za vlasnika salona
    const newWorker = new Worker({
      name: req.body.owner.name,
      role: "boss",
      user: existingUser._id,
      salons: savedSalon._id,
      workSchedules: [],
    });

    // Spremi novog radnika u bazu podataka
    const savedWorker = await newWorker.save();

    // Ažuriraj polje salons u tablici User
    existingUser.salons.push(savedSalon._id);
    await existingUser.save();

    res.status(200).json(savedSalon);
  } catch (err) {
    next(err);
  }
};

export const updateSalon = async (req, res, next) => {
  try {
    let existingUser;

    // Provjeri postoji li ownerId u owner objektu
    if (req.body.owner && req.body.owner.ownerId) {
      existingUser = await User.findById(req.body.owner.ownerId);
    } else {
      // Ako ownerId nije unesen, postavi vlasnika na usera koji je izvršio zahtjev
      existingUser = await User.findById(req.user._id);
    }

    // Provjeri postoji li korisnik s navedenim ID-om
    if (!existingUser) {
      // Ako korisnik s tim ID-om ne postoji, vrati odgovarajući odgovor
      return res.status(404).json({ message: "User not found" });
    }

    // Provjeri jedinstvenost imena salona
    const existingSalon = await Salon.findOne({ name: req.body.name });
    if (existingSalon) {
      // Ako salon s tim imenom već postoji, vrati odgovarajući odgovor
      return res
        .status(400)
        .json({ message: "Salon with this name already exists" });
    }

    // Ako korisnik nije admin, provjeri vlasnik već nije vlasnik drugog salona
    if (!existingUser.isAdmin) {
      // Provjeri da vlasnik već nije vlasnik nekog drugog salona
      const existingOwnerSalon = await Salon.findOne({
        "owner.ownerId": existingUser._id,
      });
      if (existingOwnerSalon) {
        // Ako vlasnik već ima salon, vrati odgovarajući odgovor
        return res
          .status(400)
          .json({ message: "User is already an owner of another salon" });
      }
    }

    const updatedSalon = await Salon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedSalon);
  } catch (err) {
    next(err);
  }
};


export const deleteSalon = async (req, res, next) => {
  try {
    // Pronađi salon prema ID-u
    const deletedSalon = await Salon.findById(req.params.id);

    // Ako salon ne postoji, vrati odgovarajući odgovor
    if (!deletedSalon) {
      return res.status(404).json({ message: "Salon not found" });
    }

    // Pronađi radnike koji rade u salonu
    const workersToRemove = await Worker.find({ salons: req.params.id });

    // Izbriši radnike iz tablice Worker
    await Worker.deleteMany({ salons: req.params.id });

    // Postavi salons na null u tablici User za radnike koji rade u salonu
    await User.updateMany(
      { _id: { $in: workersToRemove.map((worker) => worker.user) } },
      { $set: { salons: null } }
    );

    // Nakon što su svi radnici izbrisani i saloni postavljeni na null, možete izbrisati sam salon
    await Salon.findByIdAndDelete(req.params.id);

    res.status(200).json("Salon has been deleted!");
  } catch (err) {
    next(err);
  }
};

export const getSalon = async (req, res, next) => {
  try {
    const salon = await Salon.findById(req.params.id);
    res.status(200).json(salon);
  } catch (err) {
    next(err);
  }
};

export const getSalons = async (req, res, next) => {
  try {
    const salons = await Salon.find();
    res.status(200).json(salons);
  } catch (err) {
    next(err);
  }
};
