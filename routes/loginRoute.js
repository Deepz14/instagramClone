const express = require('express');
const router = express.Router();
const User = require('../models/users');
const bcrypt = require('bcryptjs');
const {loginValidation} = require('../validation');
const jwt = require('jsonwebtoken');
const auth = require('../validationToken');
const { SECRET_KEY } = require('../config/keys')


router.post("/", async (req, res) => {
    const { error } = loginValidation(req.body);
    //validate the request body...
    if (error) return res.status(400).json({ Message: error.details[0].message });
    //Authenticate the user from the database
    const checkUser = await User.findOne({ email: req.body.email });

    if (!checkUser)
        return res.status(401).json({ Message: "Invalid Username or Password" });

    //check password
    const validatePwd = await bcrypt.compare(
        req.body.password,
        checkUser.password
    );

    if (!validatePwd)
        return res.status(400).json({ message: "Invalid Username or Password" });

    const token = jwt.sign({id : checkUser._id}, SECRET_KEY);

    const { _id, name, email, followers, following, pic} = checkUser

    res.header('auth-token', token).json({ message: "Login Successfully", token, user: {_id, name, email, followers, following, pic}})

});

router.get('/protected',auth,(req, res) => {
    try{
        res.send('Hello jwt token is working...')
    }
    catch(err){
        res.status(401).json({message : err})
    }
})

module.exports = router;