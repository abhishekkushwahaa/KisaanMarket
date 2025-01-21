import { addCrop } from "@/controllers/cropsControllers";
import validateCrop from "@/middlewares/inputValidation";
import express from "express";
const router = express.Router();

router.post("/crop", validateCrop, addCrop);

export default router;
