import {
  addCrop,
  deleteCropByID,
  getCrops,
  reorderCrops,
  updateCropByID,
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
router.patch("/crop/reorder", authMiddleware, reorderCrops);
router.delete("/crop/:id", deleteCropByID);

export default router;
