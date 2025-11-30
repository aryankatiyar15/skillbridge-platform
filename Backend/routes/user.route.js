import express from "express";
import {
  login,
  logout,
  register,
  updateProfile,
  getCurrentUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { multiUpload } from "../middlewares/multer.js";

const router = express.Router();

router.post("/register", register); 
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, multiUpload, updateProfile);
router.get("/me", isAuthenticated, getCurrentUser);

export default router;
