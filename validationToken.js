const jwt = require('jsonwebtoken');
const User = require('./models/users');
const { SECRET_KEY } = require('./config/keys')

const auth = async(req, res, next) => {
    const token = req.header('auth-token')
    
    if(!token) return res.status(401).send('Access Denied...')

    try{
        const verified = jwt.verify(token, SECRET_KEY)
        const {id} = verified
        const userData = await User.findById(id)
        req.user = userData
        next()
    }
    catch(err){
        res.status(401).send('Invalid Token..');
    }
}

module.exports = auth