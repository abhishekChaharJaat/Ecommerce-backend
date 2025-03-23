import express from "express";
import userModal from "../modals/userModal.js"; // Unused in these routes, but kept
import productModal from "../modals/productModal.js"; // Model for products
import { requireSignin, isAdmin } from "../middlewares/authMiddleware.js";
import { uploadImage } from "../middlewares/multer.js";
const router = express.Router();

// POST route to add a product
router.post(
  "/add-new-product",
  requireSignin,
  isAdmin,
  uploadImage.single("thumbnail"),
  async (req, res) => {
    try {
      // Extract product data from request body
      const productData = req.body;

      // Create a new product instance using productModal
      const newProduct = new productModal(productData);

      // Save to MongoDB
      const savedProduct = await newProduct.save();

      // Send success response
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        product: savedProduct,
      });
    } catch (error) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors,
        });
      }

      res.status(500).json({
        success: false,
        message: "Server error while adding product",
      });
    }
  }
);

// GET route to fetch all products
router.get("/get-all-products", async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await productModal.find({});

    // Send success response with products
    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      products: products,
    });
  } catch (error) {
    // Handle server errors
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching products",
    });
  }
});

export default router;
