import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const auth = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log("Token from header:", token);
        if(!token) {
            console.log("Token missing from header");
            return res.status(401).send("Access Denied!");
        }

        const tokenValue = token.startsWith("Bearer") ? token.slice(7) : token;
        const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET || "1234!@#%<{*&)");
        console.log("Decoded token:", decoded);
        req.user = { id: decoded.user, name: decoded.name };
        next();
    } catch (error) {
        console.error("Invalid token:", error);
        res.status(401).send("Invalid token!");
    }
};
export default auth;