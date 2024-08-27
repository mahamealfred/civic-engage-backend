const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv=require('dotenv')
dotenv.config()
const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Add the user payload from the token to the request object
       
        // Optionally, fetch the full user object from the database
        req.user = await User.findById(req.user.userId).select('-password');
      
        next();
    } catch (err) {
        
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware;
