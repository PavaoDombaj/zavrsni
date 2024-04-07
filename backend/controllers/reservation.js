import Salon from "../models/Salon.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Reservation from "../models/Reservation.js";
import Service from "../models/Services.js";

export const createReservation = async (req, res, next) => {
  try {
    console.log("start c reserv");
    console.log("user " + req.body.user.id);
    let workerId;
    let selectedTime; // Definicija varijable izvan bloka if
    let serviceId;

    if (!req.body.workerId && !req.body.service) {
      if (req.body.selectedWorker && req.body.selectedService) {
        workerId = req.body.selectedWorker._id;
        serviceId = req.body.selectedService._id; // Definicija serviceId unutar bloka if
        selectedTime = req.body.selectedTime; // Postavljanje vrijednosti unutar bloka if
        console.log("ocekivana petlja");
        console.log("Selected Worker ID:", workerId);
        console.log("Selected Service ID:", serviceId);
        console.log("Selected Time:", selectedTime);
      } else {
        return next(
          createError(400, "Missing workerId or selectedWorker in request body")
        );
      }
    } else {
      workerId = req.body.workerId;
      serviceId = req.body.service; // Definicija serviceId unutar bloka else
      selectedTime = req.body.selectedTime; // Postavljanje vrijednosti unutar bloka else
    }

    // Provjera je li odabrano vrijeme još uvijek dostupno
    const isTimeAvailable = await Reservation.findOne({
      workerId: workerId,
      reservationTime: selectedTime,
    });

    if (!isTimeAvailable) {
      // Vrijeme je dostupno, nastavljamo s kreiranjem rezervacije
      // Dohvat postojećeg korisnika iz baze podataka
      const existingUser = await User.findById(req.body.user.id);
      if (!existingUser) {
        return next(createError(404, "User not found!"));
      }

      // Dohvat radnika iz baze podataka na temelju ID-a
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return next(createError(404, "Worker not found!"));
      }

      // Dohvat salona na temelju radnika
      const salon = await Salon.findOne({ workers: worker._id });
      if (!salon) {
        return next(createError(404, "Salon not found!"));
      }

      // Dohvat usluge na temelju ID-a
      const service = await Service.findById(serviceId);
      if (!service) {
        return next(createError(404, "Service not found!"));
      }

      // Kreiranje nove rezervacije
      const newReservation = new Reservation({
        userId: existingUser._id,
        workerId: worker._id,
        serviceId: service._id,
        salonId: salon._id,
        reservationTime: req.body.selectedTime,
        durationMinutes: service.durationMinutes,
        // Dodajte ostale potrebne informacije za rezervaciju
      });

      // Spremanje nove rezervacije u bazu podataka
      await newReservation.save();

      // Vraćanje uspješnog odgovora
      res.status(201).json(newReservation);
    } else {
      // Vrijeme nije dostupno
      return next(createError(400, "Selected time is not available!"));
    }
  } catch (err) {
    console.log("next err");
    next(err);
  }
};

export const updateReservation= async (req, res, next) => {
  try {
    const Reservation = await Reservation.findById(req.params.id);

    if (!Reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    const updatedReservation= await Reservation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    res.status(200).json(updatedReservation);
  } catch (err) {
    next(err);
  }
}
export const deleteReservation = async (req, res, next) => {
  try {
    console.log("user id: " + req.user.id);
    console.log("rezervation id : " + req.params.id);

    // Pronađi rezervaciju koja se želi izbrisati
    const reservation = await Reservation.findById(req.params.id);

    // Ako rezervacija nije pronađena, vrati grešku
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    console.log(reservation.userId.toString())

    // Provjeri je li korisnik administrator ili vlasnik rezervacije
    if (req.user.isAdmin || reservation.userId.toString() === req.user.id) {
      // Ako je korisnik administrator ili vlasnik rezervacije, dopusti brisanje
      const deletedReservation = await Reservation.findByIdAndDelete(
        req.params.id
      );
      return res
        .status(200)
        .json({ success: true, message: "Reservation has been deleted" });
    } else {
      // Ako korisnik nije administrator niti vlasnik rezervacije, zabrani brisanje
      console.log("user not autherized");
      return res
        .status(403)
        .json({
          success: false,
          message: "You are not authorized to delete this reservation",
        });
    }
  } catch (err) {
    // Uhvati i obradi grešku ako se dogodi
    next(err);
  }
};

export const getReservation = async (req, res, next) => {};

export const getReservations = async (req, res, next) => {};

export const getAvailableTimes = async (req, res, next) => {
  const workerId = req.params.workerId;
  const date = req.params.date;
  const selectedService = req.query.selectedService;
  const user = req.query.user;

  try {
    // Pronalazimo radnika
    const worker = await Worker.findById(workerId);
    if (!worker) {
      throw createError(404, "Worker not found");
    }

    // Pronalazimo salon radnika
    const salon = await Salon.findById(worker.salons);
    if (!salon) {
      throw createError(404, "Salon not found");
    }

    // Pronalazimo radno vrijeme salona za odabrani dan
    const desiredDay = new Date(date).toLocaleString("en-US", {
      weekday: "long",
    });
    const workingHoursForDesiredDay = salon.workingHours.find(
      (daySchedule) => daySchedule.day === desiredDay
    );
    if (!workingHoursForDesiredDay) {
      throw createError(404, `Working hours not found for ${desiredDay}`);
    }

    // Pronalazimo sve rezervacije tog dana za odabranog radnika
    const reservations = await Reservation.find({
      workerId: workerId,
      reservationTime: {
        $gte: new Date(date),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999)),
      },
    }).sort({ reservationTime: 1 }); // Sortiramo rezervacije prema vremenu

    // Izračunajte početak i kraj radnog vremena za taj dan
    const startTime = new Date(date);
    startTime.setHours(
      parseInt(workingHoursForDesiredDay.startTime.split(":")[0]),
      parseInt(workingHoursForDesiredDay.startTime.split(":")[1]),
      0,
      0
    );
    const endTime = new Date(date);
    endTime.setHours(
      parseInt(workingHoursForDesiredDay.endTime.split(":")[0]),
      parseInt(workingHoursForDesiredDay.endTime.split(":")[1]),
      0,
      0
    );

    // Izračunajte slobodna vremena
    const availableTimes = [];

    // Postavite početak vremena na prvi sat radnog vremena
    let currentTime = new Date(startTime);
    while (currentTime < endTime) {
      availableTimes.push(new Date(currentTime));
      // Dodajte 15 minuta na trenutno vrijeme
      currentTime.setMinutes(currentTime.getMinutes() + 15);
    }

    // Uklonite rezervirana vremena iz dostupnih vremena
    for (const reservation of reservations) {
      const reservationStart = new Date(reservation.reservationTime);
      const reservationEnd = new Date(reservation.reservationTime);
      reservationEnd.setMinutes(
        reservationEnd.getMinutes() + reservation.durationMinutes
      );

      // Iterirajte kroz dostupna vremena i uklonite rezervirana vremena
      let i = 0;
      while (i < availableTimes.length) {
        const availableTime = availableTimes[i];
        if (
          availableTime >= reservationStart &&
          availableTime < reservationEnd
        ) {
          availableTimes.splice(i, 1); // Uklonite rezervirano vrijeme
        } else {
          i++;
        }
      }
    }

    res.status(200).json({ availableTimes });
  } catch (error) {
    next(error);
  }
};

// Funkcija za dohvaćanje rezervacija korisnika
export const getUserReservations = async (req, res, next) => {
  try {
    console.log("Request received for user ID:", req.params.userId);

    const userId = req.params.userId;
    console.log("User ID extracted from request:", userId);

    // Dohvatite sve rezervacije korisnika s odgovarajućim ID-om
    const reservations = await Reservation.find({ userId: userId });
    console.log("Reservations found for user:", reservations);
    
    const currentTime = new Date();

    // Podijelite rezervacije na one koje su u budućnosti i one koje su već prošle
    const futureReservations = reservations.filter(reservation => new Date(reservation.reservationTime) > currentTime);
    const pastReservations = reservations.filter(reservation => new Date(reservation.reservationTime) <= currentTime);

    res.status(200).json({ futureReservations, pastReservations });
  } catch (error) {
    // Uhvatite i obradite grešku ako se dogodi
    console.error("Error occurred while fetching user reservations:", error);
    next(error);
  }
};

export const getWorkerReservations = async (req, res, next) => {
  try {
    console.log("Request received for user ID:", req.params.workerId);

    const workerId = req.params.workerId;
    console.log("User ID extracted from request:", workerId);

    // Dohvatite sve rezervacije korisnika s odgovarajućim ID-om
    const reservations = await Reservation.find({ workerId: workerId });
    console.log("Reservations found for user:", reservations);
    

    res.status(200).json(reservations);
  } catch (error) {
    // Uhvatite i obradite grešku ako se dogodi
    console.error("Error occurred while fetching user reservations:", error);
    next(error);
  }
};