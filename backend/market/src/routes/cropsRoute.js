import { addCrop, updateCropByID, deleteCropByID, getCrops } from "@/controllers/cropsControllers";
import validateCrop from "@/middlewares/inputValidation";
import express from "express";
const router = express.Router();

router.post("/crop", validateCrop, addCrop);
router.get("/crop", getCrops);
router.patch("/crop/:id", validateCrop, updateCropByID);

router.delete("/crop/:id", deleteCropByID);

export default router;
