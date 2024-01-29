import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
    /// _id ==== Dohvacanje IDa iz table users
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    user: {
        type: String, /// putem IDa iz tablice users dohvati username
        ref: 'User',
        required: true,
    },
    salons: [{
        type: mongoose.Schema.Types.ObjectId, //// linkanje sa tablicom salons 
        ref: 'Salon',
    }],
    workSchedules: [{
        type: mongoose.Schema.Types.ObjectId,//// linkanje sa tablicom
        ref: 'WorkSchedule',
    }],
});

export default mongoose.model("Worker", WorkerSchema);
