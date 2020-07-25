const joi = require('@hapi/joi');


const registerValidation = (data) => {
    const schema = joi.object({
        name : joi.string().min(4).max(20).strict().trim().required(),
        email : joi.string().min(4).email().required(),
        password : joi.string().min(6).max(20).strict().trim().required(),
        pic: joi.string().required()
    })
    return schema.validate(data)
}

const loginValidation = (data) => {
    const schema = joi.object({
        email : joi.string().email().min(4).required(),
        password : joi.string().min(6).max(20).strict().trim().required()
    })
    return schema.validate(data)
}


module.exports = {
    registerValidation,
    loginValidation
}