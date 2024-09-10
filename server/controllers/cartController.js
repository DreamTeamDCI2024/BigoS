import User from '../models/userModel.js';

export const addToCart = async (req, res, next) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!userData.cartData) {
            userData.cartData = {};
        }
        const itemId = req.body.itemId;
        if (!itemId) {
            return res.status(400).json({ message: "Item ID is required" });
        }
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = 0;  // Initialize if not exist
        }

        userData.cartData[itemId] += 1;

        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.status(200).json({ message: "Added" });
        console.log("Route hit");
        next();
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const removeFromCart = async(req, res, next) => {
    try {
        let userData = await User.findOne({ _id: req.user.id });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }
        if (!userData.cartData) {
            userData.cartData = {};
        }
        const itemId = req.body.itemId;
        if (!itemId) {
            return res.status(400).json({ message: "Item ID is required" });
        }
        if (!userData.cartData[req.body.itemId]) {
            userData.cartData[req.body.itemId] = 0; 
        }

        userData.cartData[itemId] -= 1;

        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.status(200).json({ message: "Deleted" });
        console.log("Route hit");
        next();
        
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};