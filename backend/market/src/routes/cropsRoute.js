import {
  addCrop,
  updateCropByID,
  deleteCropByID,
  getCrops,
} from "@/controllers/cropsControllers";
import authMiddleware from "@/middlewares/authMiddleware";
import validateCrop from "@/middlewares/inputValidation";
import upload from "@/middlewares/upload";
import express from "express";
const router = express.Router();

router.post(
  "/crop",
  upload.single("cropImage"),
  authMiddleware,
  validateCrop,
  addCrop
);
router.get("/crop", getCrops);
router.patch(
  "/crop/:id",
  upload.single("cropImage"),
  authMiddleware,
  updateCropByID
);
router.delete("/crop/:id", deleteCropByID);

export default router;
