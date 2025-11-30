import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }

    req.id = decoded.userId;
    req.user = await User.findById(req.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found", success: false });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Authentication failed", success: false });
  }
};

export default isAuthenticated;
