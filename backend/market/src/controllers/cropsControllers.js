import { addCropService } from "@/models/cropsModel";

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

export const addCrop = async (req, res, next) => {
  const { name, price, userID } = req.body;
  try {
    const newCrop = await addCropService(name, price, userID);
    handleResponse(res, 201, "User created successfully", newCrop);
  } catch (err) {
    next(err);
  }
};
