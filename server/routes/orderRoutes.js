import express from "express";
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  deleteOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createOrder);
router.route("/myorders").get(protect, getUserOrders);
router.route("/:id").get(protect, getOrderById).delete(protect, deleteOrder);
router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id").put(protect, updateOrderStatus)

export default router;