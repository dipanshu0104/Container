import express from "express";
import cors from "cors";

import driveRoutes from "./src/routes/drive.routes.js"

const app  = express();

app.use(cors({
  origin: "*", // React frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.use(express.json());

app.use("/drives", driveRoutes);

export default app;
