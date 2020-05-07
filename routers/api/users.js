const express = require('express');
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcryt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Keys = require('../../Config/keys')
const passport = require('passport')
const registerValidation = require('../../validation/registration');
const LoginValidation = require('../../validation/login');

const router = express.Router();

router.get('/me', (req, res)=> res.json({message: 'users work'}))

router.post('/register', (req, res)=>{
   const  { errors, isValid } = registerValidation(req.body)

   if(!isValid){
       res.status(400).json(errors)
   }
    User.findOne({email: req.body.email}).then(user=>{
        if(user){
            return res.status(400).json({email: 'Email already exist'})
        }else {
            const avater = gravatar.url(req.body.email, {
                s: '200', //Size
                r: 'pg', // Rating
                d: 'mm' //Default
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avater,
                password: req.body.password, 
            })
            bcryt.genSalt(10, (err, salt)=>{
                bcryt.hash(newUser.password, salt, (err, hash)=>{
                    if(err) throw err;
                    newUser.password =hash
                    newUser.save().then(user => res.json((user))).catch(err => console.log(err));
                })
            })
        } 
    })
})

router.post('/login', (req, res)=>{
   const  { errors, isValid } = LoginValidation(req.body)
    if(!isValid){
        res.status(400).json(errors)
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email}).then(user =>{
        if (!user){
            errors.email="User not rgisted"
            return res.json(errors)
        }
        bcryt.compare(password, user.password).then(isMatch =>{
            if(isMatch){
              //isMatch

              //JWT payload
                const payload = { id: user.id, name: user.name, avater: user.avater};
              //JWT Token
              jwt.sign(payload, Keys.secretOrKey, { expiresIn: 3600 }, (err, token)=>{
                  res.json({success: true,
                    token: 'Bearer ' + token
                })
              })
            }else{
                errors.password = 'Password incorrect!'
                return res.status(400).json(errors)
            }
        }).catch(err => console.log(err))
    })
});

router.get('/current', passport.authenticate('jwt', { session: false }),
    (req, res)=>{
        res.json({id: req.user.id, name: req.user.name, email: req.user.email})
    }
)
 
module.exports = router;