import {addCropService, deleteByIDCropService, updateByIDCropService, getAllCropsService} from "@/models/cropsModel";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const getCrops = async (req, res, next) => {
    try {
        const crops = await getAllCropsService();
        handleResponse(res, 200, "Crops retrieved successfully", crops);
    } catch (err) {
        next(err);
    }
};

export const addCrop = async (req, res, next) => {
  const { name, price, userid } = req.body;
  try {
    const newCrop = await addCropService(name, price, userid );
    handleResponse(res, 201, "Crops added successfully", newCrop);
  } catch (err) {
    next(err);
  }
};

export const updateCropByID = async (req, res, next) => {
    const { name, price, userid } = req.body;
    const { id } = req.params;
    try {
        const updatedCrop = await updateByIDCropService(name, price, userid, id);
        handleResponse(res, 200, "Crop updated successfully", updatedCrop);
    } catch (err) {
      next(err);
    }
};

export const deleteCropByID = async (req, res, next) => {
  const { id } = req.params;
  try {
        const deletedCrop = await deleteByIDCropService(id);
        handleResponse(res, 200, "Crop deleted successfully", deletedCrop);
    } catch (err) {
        next(err);
    }
};