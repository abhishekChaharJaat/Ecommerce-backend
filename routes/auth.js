import express from "express";
import bcrypt from "bcrypt";
import userModal from "../modals/userModal.js";
import JWT from "jsonwebtoken";
import { requireSignin, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/multer.js";
const router = express.Router();

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

// Register

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Validate email
    if (!name) {
      return res.status(400).send({
        success: false,
        message: "Name must be required",
      });
    }
    // Validate email
    if (!email || !emailRegex.test(email)) {
      return res.status(400).send({
        success: false,
        message: "Invalid email format",
      });
    }
    // Validate password length
    if (!password || password.length < 3) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 3 characters long",
      });
    }
    // Check if user already exists
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = new userModal({
      name: name,
      email: email,
      password: hashedPassword,
    });

    await newUser.save();
    const user = await userModal.findOne({ email: email });
    const token = JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
      token: token,
    });
  } catch (error) {
    // console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in registration",
      error: error.message,
    });
  }
});

// Login

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    const user = await userModal.findOne({ email: email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const matchedPassword = await bcrypt.compare(password, user.password);
    if (!matchedPassword) {
      return res.status(401).send({
        success: false,
        message: "Invalid password",
      });
    }
    const token = JWT.sign({ _id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "Login successfully",
      user: {
        name: user.name,
        email: user.email,
      },
      token: token,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

router.get("/user-info", requireSignin, async (req, res) => {
  try {
    const id = req.user._id; // Get the user ID from the decoded JWT token

    // Find the user by ID, and exclude the password field
    const user = await userModal.findById(id).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    // Return user data (excluding password)
    res.status(200).send({
      success: true,
      message: "User information retrieved successfully",
      user: user,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "An error occurred while retrieving user info",
      error: error.message,
    });
  }
});

// Update User Information
router.put(
  "/update-user-info",
  requireSignin,
  uploadImage.single("profilePicture"),
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        address,
        profilePicture,
        pincode,
        role,
        gender,
      } = req.body;

      // console.log(req.body);
      const userId = req.user._id; // Get the user ID from the decoded JWT token

      // Check if the user exists
      const user = await userModal.findById(userId);
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found",
        });
      }
      // Create an object with the fields to update
      const updatedData = {
        name: name || user.name,
        email: email || user.email,
        phone: phone || user.phone,
        address: address || user.address,
        profilePicture: profilePicture || user.profilePicture,
        pincode: pincode || user.pincode,
        role: role || user.role,
        gender: gender || user.gender,
      };

      // Update the user's data
      const updatedUser = await userModal.findByIdAndUpdate(
        userId,
        updatedData,
        {
          new: true,
        }
      );

      // Return the updated user data (excluding password)
      res.status(200).send({
        success: true,
        message: "Profile updated successfully",
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          address: updatedUser.address,
          profilePicture: updatedUser.profilePicture,
          pincode: updatedUser.pincode,
          role: updatedUser.role,
          gender: updatedUser.gender,
        },
      });
    } catch (error) {
      res.status(500).send({
        success: false,
        message: "Error updating user information",
        error: error.message,
      });
    }
  }
);

export default router;
