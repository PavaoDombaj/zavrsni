import mongoose from "mongoose";

const WorkScheduleSchema = new mongoose.Schema({
    worker: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
        required: true,
    },
    day: {
        type: Date,
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
    isAvailable: {
        type: Boolean,
        default: true,
    },
});

export default mongoose.model("WorkSchedule", WorkScheduleSchema);
