import express from "express";
import cors from "cors";

import foldersRoutes from "./src/routes/folders.routes.js"

const app  = express();

app.use(cors({
  origin: "*", // React frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));


app.use(express.json());

app.use("/folders", foldersRoutes);



export default app;
