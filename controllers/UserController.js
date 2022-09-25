const jwt = require('jsonwebtoken');
const becrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');

// @desc    Register user
// @route   post /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
        return res.json({error: 'Please add all fields'})

    }
    
    if(password.length < 6) {
        return res.status(400).send({error: 'Password must be at least 6 characters'})
    }

    const userExist = await User.findOne({ email });
    if(userExist) {
        return res.json({error: 'User already exists'})
    }

    const salt = await becrypt.genSalt(10);
    const hashedPassword = await becrypt.hash(password, salt);
    const user = await User.create({
        name,
        email,
        hashedPassword,
    })

    if(user){
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        return res.json({error: 'Invalid credentials'})
    }

});


// @desc    Authenticate a user
// @route   Post /api/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body;
    console.log(req.body);

    const user = await User.findOne({email});
    if(user && await becrypt.compare(password, user.hashedPassword)){
        
        res.status(200).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else{
        return res.json({error: 'Invalid credentials'})
    }

})

// @desc    Get user data
// @route   Get /api/users/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const {_id, name, email} = await User.findById(req.user.id);
    res.status(200).json({
        id: _id,
        name,
        email,
    })
})



// @desc    Updates user's data
// @route   Put /api/users/update
// @access  Private
const updateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    console.log(user);
    if(!user){
        return res.status(400).send({error: 'User not found'})
    }
    const {name, email, password} = req.body;

    if(password.length < 6){
        return res.status(400).send({error: 'Password must be at least 6 characters'})
    }

    if(email === user.email){
        return res.status(400).send({error: "Email can't be the same as the old one"})
    }
    const salt = await becrypt.genSalt(10);
    const hashedPassword = await becrypt.hash(password, salt);
    user.name = name;
    user.email = email;
    user.hashedPassword = hashedPassword;


    await user.save();
    res.status(200).send({
        id: user.id,
        name: user.name,
        email: user.email,
    })

});



const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'})
}



module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUser
}
