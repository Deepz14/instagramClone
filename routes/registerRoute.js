const express = require('express');
const router = express.Router();
const User = require('../models/users'); 
const { registerValidation } = require('../validation');
const bcrypt = require('bcryptjs'); 

router.get('/', (req, res) => {
    res.send('Hello world!')
})

router.post('/', async(req, res) => {
    const { error } = registerValidation(req.body)
    //validate the request body...
    if(error) return res.status(400).json({Message : error.details[0].message})
    //Authenticate the user from the database
    const checkUser = await User.findOne({email : req.body.email})

    if(checkUser) return res.status(401).json({Message : "User Already exists..."})

    //hash password
    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    try{
        const postUser = new User({
            name : req.body.name,
            email : req.body.email,
            password : hashPassword,
            pic : req.body.pic
        })
        const saveUser = await postUser.save()
        res.json({Message : "User is Posted Succesfully!!", id : postUser._id})
    }
    catch(err){
        res.status(404).json({Message : err})
    }
})




module.exports = router;