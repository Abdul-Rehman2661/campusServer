import express from "express"
import { SignUp, login, logout, GetAllUsers, GetLoggedInUser, updateUser, getUserById } from "../controllers/user.controller.js";
import {authenticate} from "../middlewares/user.middleware.js"

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", login);
router.post("/logout",authenticate, logout);
router.get("/users/:id", getUserById);
router.get("/AllUsers", GetAllUsers);
router.get("/GetLoggedIn",authenticate, GetLoggedInUser);
router.put("/update/:userId", updateUser);

export default router