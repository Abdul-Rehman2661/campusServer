import Joi from "joi";
import messages from "../utils/messages.js";

export const signupValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().required().messages({
      "string.empty": messages.empytyField,
    }),
    email: Joi.string().email().required().messages({
      "string.empty": messages.empytyField,
      "string.email": "Invalid email format",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": messages.empytyField,
      "string.min": messages.passwordlength,
    }),
    role: Joi.string().optional(),
  });

  return schema.validate(data);
};

export const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.empty": messages.empytyField,
      "string.email": "Invalid email format",
    }),
    password: Joi.string().min(6).required().messages({
      "string.empty": messages.empytyField,
      "string.min": messages.passwordlength,
    }),
  });

  return schema.validate(data);
};
