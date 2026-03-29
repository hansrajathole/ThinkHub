import config from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import redis from "../services/redis.service.js";
export const protectRoute = async function (req, res, next) {
 
    try {
        const token =  req.headers?.authorization?.split(" ")[1] || req.cookies.jwt;
       
        if(!token) {
            return res.status(401).json({ message: 'You need to be logged in' });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        
        if(!decoded) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const isBlacklisted = await redis.get(`blacklist:${token}`);
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Token has been invalidated' });
        }

        const user = await userModel.findById(decoded.id);
        
        if(!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        req.user = user;
        req.tokenData = { ...decoded, token };
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
