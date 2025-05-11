import mongoose from "mongoose";

const DayScheduleSchema = new mongoose.Schema({
    day: {
        type: String, // Možete koristiti String za ime dana (npr. "Monday", "Tuesday", ...)
        required: true,
    },
    startTime: {
        type: String, // Možete koristiti String za vreme u formatu "HH:mm" (npr. "08:00")
        required: true,
    },
    endTime: {
        type: String, // Možete koristiti String za vreme u formatu "HH:mm" (npr. "17:00")
        required: true,
    },
});

const SalonSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    owner: {
        username: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    location: {
        type: {
            city: String,
            address: String,
        },
        required: true,
        _id: false,
    },
    images: {
        type: [String],
    },
    description: {
        type: String,
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
    }],
    workers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Worker',
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5,
    },
    workingHours: {
        type: [DayScheduleSchema], // Dodajemo polje za radno vreme
        required: true,
    },
});

export default mongoose.model("Salon", SalonSchema);
