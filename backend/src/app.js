import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import cors from "cors";
import connectToSocket from "./controllers/socketManager.js";
import userRoutes from "./routes/usersRoutes.js";

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

const mongo_url = "mongodb+srv://shubhi123:shubhi123@meetspherecluster.sshpxbc.mongodb.net/Meetsphere?retryWrites=true&w=majority&appName=MeetsphereCluster";
await mongoose.connect(mongo_url);
console.log("database connected");