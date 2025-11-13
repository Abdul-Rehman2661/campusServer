import messages from "../utils/messages.js";
import {
  signUpService,
  loginService,
  GetAllUserService,
  GetLoggedinUserService,
  UpdateUserService,
  getUserByIdService
} from "../services/user.service.js";
import {
  signupValidation,
  loginValidation,
} from "../validations/user.validation.js";
import {
  badRequestErrorResponse,
  serverErrorResponse,
  successResponse,
  authorizationErrorResponse,
} from "../utils/response.js";
import { generateToken } from "../utils/jwt.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs";

export const SignUp = async (req, res) => {
  const { error } = signupValidation(req.body);

  if (error) {
    return badRequestErrorResponse(res, error.details[0].message);
  }

  try {
    const user = await signUpService(req.body);

    const token = generateToken(user._id, user.role);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    await user.save();

    return successResponse(res, messages.userRegister, {
      ...user.toObject(),
      token,
    });
  } catch (err) {
    console.log("SignUp error:", err);
    const msg = err.message || messages.SignUpErr;
    return serverErrorResponse(res, msg);
  }
};


export const login = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return badRequestErrorResponse(res, error.details[0].message);
  }

  try {
    const user = await loginService(req.body);
    const token = generateToken(user._id, user.role);

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    });

    return successResponse(res, messages.ok, { ...user, token });
  }  catch (err) {
  if (err.message === messages.NotFound) {
    return notFoundResponse(res, err.message);
  }

  if (err.message === messages.WrongPass) {
    return authorizationErrorResponse(res, err.message);
  }

  return serverErrorResponse(res, messages.logInErr);
};
}

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return successResponse(res, messages.logout);
  } catch (err) {
    serverErrorResponse(res, messages.logOutErr);
  }
};

// controller
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await getUserByIdService(id);

    if (!result) {
      return badRequestErrorResponse(res, messages.NotFound);
    }

    return successResponse(res, messages.ok, result);

  } catch (error) {
    return serverErrorResponse(res, messages.getUserById);
  }
};


export const GetAllUsers = async (req, res) => {
  try {
    const { fullName, role, location} = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    if (fullName) {
      filter.fullName = { $regex: fullName, $options: "i" };
    }

    const users = await GetAllUserService(filter);

    successResponse(res, messages.ok, users);
  } catch (error) {
    console.log(error)
    serverErrorResponse(res, messages.GetAllUserErr);
  }
};

export const GetLoggedInUser = async (req, res) => {
  try {
    const user = await GetLoggedinUserService(req.user.userId);
    if (!user) {
      return authorizationErrorResponse(res, messages.unauthorized);
    }
    return successResponse(res, messages.ok, user);
  } catch (err) {
    serverErrorResponse(res, messages.GetLoggedInUserErr);
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, password, role } = req.body;

    // Prepare update object
    const updateData = {
      fullName,
      password,
      role,
     
    };

    // Handle password (only if provided)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }


    const updatedUser = await UpdateUserService(userId, updateData);

    if (!updatedUser) {
      return badRequestErrorResponse(res, messages.UpdateUserErr);
    }

    return successResponse(res, messages.updateSuccess, {
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return serverErrorResponse(res, messages.UpdateUserErr);
  }
};

