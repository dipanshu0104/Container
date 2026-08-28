import express from "express";
import path from "path"
import authRoutes from "./src/routes/auth.routes.js"
import cors from "cors"

const app  = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use("/auth", authRoutes);
app.use("/avatars", express.static(path.join(process.cwd(), "uploads", "avatars")));




export default app;

