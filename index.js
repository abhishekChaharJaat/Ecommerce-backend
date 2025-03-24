import express from "express";
import { configDotenv } from "dotenv";
import connectDataBase from "./config/connectDataBase.js";
import authRoutes from "./routes/auth.js";
import productRoute from "./routes/product.js";
import cors from "cors";
const app = express();

configDotenv();
connectDataBase();
// Enable CORS for all routes
app.use(
  cors({
    origin: [
      "https://abhishekshopshare.netlify.app",
      "http://localhost:5000" 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
    credentials: true,  // Allow cookies or auth headers
  })
);


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v2/product", productRoute);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server running on PORT:" + PORT);
});
