const express = require('express');
const mongoose = require('mongoose');


const users = require('./routers/api/users')
const posts = require('./routers/api/posts')
const profile = require('./routers/api/profile')

const app = express();
//DB Config
const db = require('./Config/keys').mongoURL
//Connect to MongoDB
mongoose.connect(db,{ useNewUrlParser: true, useUnifiedTopology: true }).then(()=> console.log('MongoDB is Connected')).catch((err)=> console.log(err));


app.get('/', (req, res)=> console.log('hello'));


//Roure middleware
app.use('/api/users', users)
app.use('/api/profile', profile)
app.use('/api/posts', posts)
const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`Server run on port ${port}`))