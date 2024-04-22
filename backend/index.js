import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import salonRoute from "./routes/salon.js";
import workerRoute from "./routes/worker.js";
import servicesRoute from "./routes/services.js"
import reservationRoute from "./routes/reservation.js"
import reviewRoute from "./routes/review.js";
import cookieParser from "cookie-parser";
import cors from 'cors'; 



const app = express();
dotenv.config();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));


const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!!!");
});

//middlewares
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/salons", salonRoute);
app.use("/api/worker", workerRoute);        
app.use("/api/services", servicesRoute);
app.use("/api/reservation", reservationRoute);
app.use("/api/review", reviewRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || "Something went wrong"
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
})

const PORT = 8800
app.listen(PORT, () => {
    connect();
    console.log("Connected to backend.");
});
