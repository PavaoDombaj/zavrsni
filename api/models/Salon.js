import mongoose from "mongoose";

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
});

export default mongoose.model("Salon", SalonSchema);
