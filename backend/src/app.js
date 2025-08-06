import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/usersRoutes.js";
import dotenv from 'dotenv';
dotenv.config();


const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", (process.env.port || 8080));
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/users", userRoutes);

server.listen(app.get("port"), () => {
    console.log("app is running");
})

const mongo_url = process.env.MONGO_URL;
await mongoose.connect(mongo_url);
console.log("database connected");