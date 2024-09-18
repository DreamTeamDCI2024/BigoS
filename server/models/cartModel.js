import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item', 
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1, 
        default: 1
    }
});
const cartSchema = new mongoose.Schema({
    items: [cartItemSchema] 
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;