import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  salonId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salon",
    required: true,
  },
  rating:{
    type: Number,
    min: 0,
    max: 5,
  }
});


export default ReviewSchema;
