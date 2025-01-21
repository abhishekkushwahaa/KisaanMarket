import Joi from "joi";

const cropScheme = Joi.object({
  name: Joi.string().min(3).required(),
  price: Joi.string().min(2).required(),
  userID: Joi.string()
});

const validateCrop = (req, res, next) => {
  const { error } = cropScheme.validate(req.body);
  if (error)
    return res.status(400).json({
      status: 400,
      message: error.details[0].message,
    });
  next();
};

export default validateCrop;
