import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name:{
      type: String,
      required:true,
      default: "Ime Prezime",
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone:{
        type: Number,
        required: false,
    },
    birthDate:{
        type:Date,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    salons: [{
        type: mongoose.Schema.Types.ObjectId,
        default:null,
    }],
}, { timestamps: true });

export default mongoose.model("User", UserSchema);
