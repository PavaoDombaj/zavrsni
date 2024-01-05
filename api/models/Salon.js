import mongoose from "mongoose";



const SalonSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    vlasnik:{
        type: String,
        required:true
    },
    grad:{
        type: String,
        required:true
    },
    adresa:{
        type: String,
        required:true
    },
    images:{
        type: [String]
    },
    descripton: {
        type: String
    },
    usluge:{
        type: [String]
    },
    workers:{
        type: [String]
    },
    rating:{
        type: Number,
        min:0,
        max:5
    }
})

export default mongoose.model("Salon", SalonSchema);