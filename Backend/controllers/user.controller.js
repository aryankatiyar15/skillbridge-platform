import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;
    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email.", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
        folder: "skillbridge_profiles",
        resource_type: "image",
      });
      profilePhotoUrl = uploadResponse.secure_url;
    }

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: { profilePhoto: profilePhotoUrl },
    });

    return res.status(201).json({ message: "Account created successfully", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials", success: false });

    if (user.role !== role)
      return res.status(400).json({ message: "Invalid role for this account", success: false });

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: "7d" });

    const cookieOptions = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    const safeUser = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, cookieOptions)
      .json({ message: `Welcome back, ${user.fullname}`, user: safeUser, success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  return res.status(200).cookie("token", "", { maxAge: 0 }).json({
    message: "Logged out successfully.",
    success: true,
  });
};

// UPDATE PROFILE (Both PDF + Image)
export const updateProfile = async (req, res) => {
  try {
    const { fullname, phoneNumber, bio, skills } = req.body;
    const userId = req.id || req.user?._id;
    let user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found", success: false });

    // Basic Info
    if (fullname) user.fullname = fullname;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.profile.bio = bio;
    if (skills)
      user.profile.skills = skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

    // Files
    if (req.files) {
      const { profilePhoto, resume } = req.files;

      // Profile Photo Upload
      if (profilePhoto?.[0]) {
        const fileUri = getDataUri(profilePhoto[0]);
        const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
          folder: "skillbridge_profiles",
          resource_type: "image",
          public_id: `${user._id}_profile_${Date.now()}`,
        });
        user.profile.profilePhoto = uploadResponse.secure_url;
      }

      // Resume Upload (PDF)
      if (resume?.[0]) {
        const fileUri = getDataUri(resume[0]);
        const uploadResponse = await cloudinary.uploader.upload(fileUri.content, {
          folder: "skillbridge_resumes",
          resource_type: "raw", 
          public_id: `${user._id}_resume_${Date.now()}`,
        });
        user.profile.resume = uploadResponse.secure_url; // Use direct URL
        user.profile.resumeOriginalName = resume[0].originalname;
      }
    }

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      user,
      success: true,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// GET CURRENT USER
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found", success: false });
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", success: false });
  }
};
