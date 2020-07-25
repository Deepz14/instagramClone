const express = require('express');
const app = express();
const mongoose = require('mongoose');
const registerPage = require('./routes/registerRoute');
const loginPage = require('./routes/loginRoute');
const postPage = require('./routes/postRoute');
const userPage = require('./routes/userRoute');

const PORT = process.env.PORT || 5000

const { MOGOURI } = require('./config/keys')

//mongoose connecting to database
mongoose.connect(MOGOURI, { useNewUrlParser : true, useUnifiedTopology : true })
.then((result) => {
    app.listen(PORT, () => {
        console.log(`Server running on PORT : ${PORT}`)
    })
})
.catch(err => console.log(err))

app.use(express.json());

app.use('/user', registerPage);

app.use('/login', loginPage);

app.use('/post', postPage);

app.use('/userprofile', userPage);

if(process.env.NODE_ENV === "production"){
    app.use(express.static('Client/build'))
    const path = require('path')
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'Client', 'build', 'index.html'))
    })
}