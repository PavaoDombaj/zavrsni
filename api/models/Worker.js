import mongoose from "mongoose";

const WorkerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    salons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Salon',
    }],
    workSchedules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkSchedule',
    }],
});

export default mongoose.model("Worker", WorkerSchema);
