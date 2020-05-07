const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');



//load Models
const Profile = require('../../models/Profile');
const user = require('../../models/User')



const errors = {}
//GET METHOD
router.get('/', passport.authenticate('jwt',{ session: false}), (req, res)=>{
  Profile.findOne({ user: req.user.id })
  .populate('user',['name', 'avater'])
  .then(profile =>{
    if(!profile){
      errors.noprofile ='No profile for this user';
      res.status(404).json(errors);
    }else{

      res.json(profile);
    }
  })
  .catch((err)=>console.log(err));
});

router.post('/', passport.authenticate('jwt', {session: false}), (req, res)=>{

  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle= req.body.handle;
  if(req.body.company) profileFields.company= req.body.company;
  if(req.body.website) profileFields.website= req.body.website;
  if(req.body.location) profileFields.location= req.body.location;
  if(req.body.bio) profileFields.bio= req.body.bio;
  if(req.body.status) profileFields.status= req.body.status;
  if(req.body.gitusername) profileFields.gitusername= req.body.gitusername;
  if(typeof req.body.skills !== 'undefined'){
    profileFields.skills = req.body.skills.split(',');

    //social field
    profileFields.social = {}
    if(req.body.facebook) profileFields.facebook= req.body.facebook;
    if(req.body.twitter) profileFields.twitter= req.body.twitter;
    if(req.body.instagram) profileFields.instagram= req.body.instagram;
    if(req.body.linkin) profileFields.linkin= req.body.linkin;    
  } 

  Profile.findOne({user: req.user.id}).then(profile =>{
    if(profile){
      //update
      Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new: true})
      .then(profile =>res.json(profile));
    }else{
      Profile.findOne({handle: profileFields.handle})
      .then(profile =>{
        if(profile){
          errors.handle = 'That handler already exist';
          res.status(404).json(errors);
        }
        //Save Profile
        new Profile(profileFields).save()
        .then(profile =>
          res.status(200).json(profile)
        )
      }).catch((err)=> res.status(400).json(err))
    }
  })
  
})

// FIND USER BY HANDLE
router.get('/handle/:handle',(req, res)=>{
  Profile.find({handle: req.params.handle})
  .populate('user', ['name', 'avater'])
  .then(profile =>{
    if(profile){
      res.status(200).json(profile);
    }else{
      res.status(404).json(errors);
      errors.handle = 'No handler available';
    }
  }).catch(err=>res.status(400).json({profile: 'There is no handle for this user'}))
});

router.get('/user/:user_id', (req, res)=>{
  Profile.findOne({user: req.params.user_id})
  .then(profile =>{
    if(profile){
      res.status(200).json(profile);
    }else{
      errors.userid = 'This user is not available';
      res.status(404).json(errors)
    }
  }).catch((err)=> res.status(400).json({profile: 'There is no profile for this user'}))
});

router.get('/all', (req, res)=>{
  Profile.find().populate('user', ['name', 'user'])
  .then(profile =>{
    if(profile){
      res.status(200).json(profile);
    }else{
      errors.all = 'No profiles are available at the moment';
      res.status(404).json(errors);
    }
  })
});

router.post('/experience', passport.authenticate('jwt', { session: false }), (req, res)=>{
  Profile.findOne({user: req.user.id})
  .populate('user', ['name', 'avater']).then(
    profile =>{
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description
      }
      profile.experience.unshift(newExp);
      profile.save().then(profile => res.status(200).json(profile));
    }
  )
});

router.post('/education', passport.authenticate('jwt', {session: false}), (req, res)=>{
  Profile.findOne({user: req.user.id})
  .populate('user', ['name', 'avater'])
  .then(profile =>{
    newEdu = {
      school: req.body.school,
      degree: req.body.degree,
      fieldofstudy: req.body.fieldofstudy,
      from: req.body.from,
      to: req.body.to,
      current: req.body.current,
      description: req.body.description
    }
  profile.education.unshift(newEdu)
    profile.save().then(education => res.status(200).json(education));
  })
})

module.exports = router;