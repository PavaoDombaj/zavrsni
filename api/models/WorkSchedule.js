import mongoose from "mongoose";

const WorkScheduleSchema = new mongoose.Schema({
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true,
    },
    // Dodano polje za radne dane u tjednu
    workingDays: {
        type: [String], // Npr. ["Monday", "Wednesday"]
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
        required: true,
    },
    // Dodano polje za pauzu
    break: {
        startTime: {
            type: Date,
            default: null,
        },
        endTime: {
            type: Date,
            default: null,
        },
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model("WorkSchedule", WorkScheduleSchema);
