import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
    },
    priceBySalon: [{
        salon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Salon',
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
    }],
});

export default mongoose.model("Service", ServiceSchema);
