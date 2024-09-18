import express from "express";
import { createPayment, handleWebhook } from "../controllers/paymentController.js";
import { protect } from "../middleware/authMiddleware.js"; 

const router = express.Router();

// To Create a payment

router.post("/create", protect, createPayment);



// Stripe Webhook (endpoint publicly accessible by Stripe)

router.post("/webhook", express.raw({ type: "application/json" }), handleWebhook);

export default router;