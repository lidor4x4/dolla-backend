const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');


const protect = asyncHandler(async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];
            
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-hashedPassword');
            next();
        } catch (e){
            return res.status(401).json({message: 'Unauthorized'});
        }
    }

    if(!token){
        return res.status(401).json({message: 'Unauthorized, no token provided'})

    }
})

module.exports = {protect};
