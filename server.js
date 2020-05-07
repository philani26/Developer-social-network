const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const passport = require('passport')



const users = require('./routers/api/users')
const posts = require('./routers/api/posts')
const profile = require('./routers/api/profile')

const app = express();

//MiddleWare
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//DB Config
const db = require('./Config/keys').mongoURL
//Connect to MongoDB
mongoose.connect('mongodb://localhost/devmeetup',{ useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false }).then(()=> console.log('MongoDB is Connected')).catch((err)=> console.log(err));

// Passport Middleware
app.use(passport.initialize());

//Passport Config
require('./Config/passport')(passport);



//Roure middleware
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server run on port ${port}`))