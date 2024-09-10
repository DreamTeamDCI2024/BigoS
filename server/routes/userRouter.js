import express from "express";
import { signUp, login, getAllUsers, loggedIn, updateUser, deleteUser } from "../controllers/userController.js";
import auth from '../middleware/auth.js';

const router = express.Router();

//http://localhost:4000/user/signup/
router.post("/signup", signUp);

//http://localhost:4000/user/login/
router.post("/login", login);

//http://localhost:4000/user/allusers
router.get("/allusers", getAllUsers);

//http://localhost:4000/user/profile/
router.get("/profile", auth, loggedIn);

//http://localhost:4000/user/delete/:id
router.delete("/delete/:id", auth, deleteUser);

//http://localhost:4000/user/update/
router.put("/update", auth, updateUser);

export default router;