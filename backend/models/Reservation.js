// Rezervacije (Reservations) Schema
import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  salonId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
  },
  reservationTime: {
    type: Date,
    required: true,
  },
  durationMinutes:{
    type:Number,
    required:true,
  }
});

const Reservation = mongoose.model("Reservation", ReservationSchema);

export default Reservation;
