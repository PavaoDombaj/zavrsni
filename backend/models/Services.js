// Usluge (Services) Schema
import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required:false
  },
  durationMinutes: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  SalonId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
  }
});

const Service = mongoose.model("Service", ServiceSchema);

export default Service;
