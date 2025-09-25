import express from "express";
import cors from "cors";
import errorHandling from "@/middlewares/errorHandling";
require("dotenv").config();
import cropsRoute from "@/routes/cropsRoute";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.json());

// Routes
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api", cropsRoute);

// Error handling middleware
app.use(errorHandling);

// Start server for
app.listen(process.env.PORT || 5001, () => {
  console.log(`Postgres Server listening on port ${process.env.PORT}`);
});
