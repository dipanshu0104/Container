import express from "express"
import cors from "cors";
import filesRouter from "./src/routes/files.routes.js"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: "*", // React frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// routes direction

app.use("/files", filesRouter);

export default  app;