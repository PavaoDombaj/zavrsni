import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true,
    },
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    },
    clientName: {
        type: String,
        required: true,
    },
    dateTime: {
        type: Date,
        required: true,
    },
});

export default mongoose.model("Reservation", ReservationSchema);
