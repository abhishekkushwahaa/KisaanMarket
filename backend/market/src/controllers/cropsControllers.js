import {
  addCropService,
  deleteByIDCropService,
  getAllCropsService,
  getCropByIDService,
  updateByIDCropService,
  updateCropOrder,
} from "@/models/cropsModel";
import fs from "fs";
import path from "path";

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

export const reorderCrops = async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    const userid = req.user.id;

    if (!Array.isArray(orderedIds)) {
      return handleResponse(res, 400, "Invalid data format.");
    }

    const updatePromises = orderedIds.map((cropId, index) => {
      return updateCropOrder(cropId, index, userid);
    });

    await Promise.all(updatePromises);
    handleResponse(res, 200, "Crop order updated successfully");
  } catch (err) {
    next(err);
  }
};

export const addCrop = async (req, res, next) => {
  const { name, price } = req.body;

  const userid = req.user.id;

  if (!req.file) {
    return handleResponse(res, 400, "Image is required");
  }
  const image = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  try {
    const newCrop = await addCropService(name, price, userid, image);
    handleResponse(res, 201, "Crops added successfully", newCrop);
  } catch (err) {
    next(err);
  }
};

export const updateCropByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, price } = req.body;
    const userid = req.user.id;

    const existingCrop = await getCropByIDService(id);
    if (!existingCrop) {
      return handleResponse(res, 404, "Crop not found");
    }

    let imageUrl = existingCrop.image;

    if (req.file) {
      imageUrl = `${process.env.BACKEND_PUBLIC_URL}/uploads/${req.file.filename}`;

      if (existingCrop.image) {
        const oldImageFilename = existingCrop.image.split("/uploads/")[1];
        const oldImagePath = path.join("./uploads", oldImageFilename);

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedCrop = await updateByIDCropService(
      name,
      price,
      imageUrl,
      id,
      userid
    );
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

// export const getCrops = async (req, res, next) => {
//   try {
//     const page = parseInt(req.query.page, 10) || 1;
//     const limit = parseInt(req.query.limit, 10) || 10;
//     const offset = (page - 1) * limit;

//     const crops = await getAllCropsService(limit, offset);
//     const totalCrops = await countAllCropsService();
//     const totalPages = Math.ceil(totalCrops / limit);

//     // Send back the data along with pagination info
//     res.status(200).json({
//       status: 200,
//       message: "Crops retrieved successfully",
//       data: crops,
//       pagination: {
//         currentPage: page,
//         totalPages: totalPages,
//         totalCrops: totalCrops,
//       },
//     });
//   } catch (err) {
//     next(err);
//   }
// };
