import express from "express";
import auth from '../middleware/auth.js';
import { addToCart, removeFromCart } from "../controllers/cartController.js";

const router = express.Router();

router.post('/addtocart', auth, addToCart);
router.post('/removefromcart', auth, removeFromCart );

export default router;