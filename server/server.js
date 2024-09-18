import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/productRouter.js";
import userRouter from "./routes/userRouter.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import cartRouter from './routes/cartRouter.js';

dotenv.config();

// Initialize the app
const app = express();

// PORT
const PORT = process.env.PORT || 4000;

//CORS cofiguration
const corsOptions = {
  origin: 'http://localhost:3000',  // Permite solicitudes desde tu frontend
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Use the json middleware
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb", extended: true }));

// Paths
app.use("/api", productRoutes);
app.use("/api/user", userRouter);
app.use("/api/orders", orderRoutes)
app.use("/api/payments", paymentRoutes);
app.use("/api/cart", cartRouter);
// Listening server
mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Hello and welcome back your server running on ${PORT}`);
    });
  })
  .catch((error) => console.log(error));

console.log("PORT:", process.env.PORT);
console.log("CONNECTION_URL:", process.env.CONNECTION_URL);
