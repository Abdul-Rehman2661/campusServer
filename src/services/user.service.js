import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import messages from "../utils/messages.js";

export const signUpService = async ({
  fullName,
  email,
  password,
  role,
  
}) => {
  const already = await User.findOne({ email });
  if (already) {
    throw new Error(messages.emailAlreadyExist);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    fullName,
    email,
    password: hashedPassword,
    role,
  });

  await newUser.save();
  return newUser; // return full user document
};


export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(messages.NotFound);
  }

  const isPassword = await bcrypt.compare(password, user.password);
  if (!isPassword) {
    throw new Error(messages.WrongPass);
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
  };
};


export const getUserByIdService = async (id) => {
  const user = await User.findById(id).select("-password");

  if (!user) return null;

  // fetch all properties added by this user
  const properties = await Property.find({ agentId: id });

  return { user, properties };
};

export const GetAllUserService = async (filters = {}) => {
  return await User.find(filters);
};

export const GetLoggedinUserService = async (userId) => {
  if (!userId) return null;

  const user = await User.findById(userId).select("-password");
  if (!user) return null;

  const properties = await Property.find({ agentId: userId }); 

  return { ...user.toObject(), properties };
};

export const UpdateUserService = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};
