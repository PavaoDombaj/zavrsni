import Salon from "../models/Salon.js";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import Reservation from "../models/Reservation.js";
import Service from "../models/Services.js";

export const createReservation = async (req, res, next) => {
  try {
    // Dohvatite postojećeg korisnika iz baze podataka
    const existingUser = await User.findById(req.user.id);
    if (!existingUser) {
      return next(createError(404, "User not found!"));
    }

    // Dohvatite radnika iz baze podataka na temelju ID-a
    const worker = await Worker.findById(req.body.workerId);
    if (!worker) {
      return next(createError(404, "Worker not found!"));
    }

    // Dohvatite salon na temelju radnika
    const salon = await Salon.findOne({ workers: worker._id });
    if (!salon) {
      return next(createError(404, "Salon not found!"));
    }
    const service = await Service.findOne({ _id: req.body.service });
    if (!service) {
      return next(createError(404, "service not found!"));
    }

    // Kreirajte novu rezervaciju
    const newReservation = new Reservation({
      userId: existingUser._id,
      workerId: worker._id,
      serviceId: service._id, // Provjerite kako dohvaćate ID usluge iz zahtjeva
      salonId: salon._id,
      durationMinutes: service.durationMinutes,
      // Dodajte ostale potrebne informacije za rezervaciju
    });

    // Spremite novu rezervaciju u bazu podataka
    await newReservation.save();

    // Vratite uspješan odgovor
    res.status(201).json(newReservation);
  } catch (err) {
    // Uhvatite i obradite grešku
    next(err);
  }
};

export const updateReservation = async (req, res, next) => {
  /// TODO treba obavezno provjerit
};

export const deleteReservation = async (req, res, next) => {};

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
    const desiredDay = new Date(date).toLocaleString("en-US", { weekday: "long" });
    const workingHoursForDesiredDay = salon.workingHours.find(daySchedule => daySchedule.day === desiredDay);
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
    startTime.setHours(parseInt(workingHoursForDesiredDay.startTime.split(":")[0]), parseInt(workingHoursForDesiredDay.startTime.split(":")[1]), 0, 0);
    const endTime = new Date(date);
    endTime.setHours(parseInt(workingHoursForDesiredDay.endTime.split(":")[0]), parseInt(workingHoursForDesiredDay.endTime.split(":")[1]), 0, 0);

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
      reservationEnd.setMinutes(reservationEnd.getMinutes() + reservation.durationMinutes);

      // Iterirajte kroz dostupna vremena i uklonite rezervirana vremena
      let i = 0;
      while (i < availableTimes.length) {
        const availableTime = availableTimes[i];
        if (availableTime >= reservationStart && availableTime < reservationEnd) {
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

