import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import {Server} from "socket.io"

import filesService from "./modules/files/app.js";
import authService from "./modules/auth/app.js";
import foldersService from "./modules/folders/app.js";
import setupService from "./modules/drive/app.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Update with frontend URL in production
    methods: ["GET", "POST", "DELETE", "PUT"],
  },
});

app.set("io", io); // Make io accessible in routes



app.use(express.json());
app.use(cookieParser());

// Microservices routes
app.use("/api", filesService);
app.use("/api", authService);
app.use("/api", foldersService);
app.use("/api", setupService);

app.get("/", (req, res) => {
  res.status(200).json("hi from main file.");
});

server.listen(PORT, () => {
  console.log(`🚀 API Gateway running on port 5000`);
});
