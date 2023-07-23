const express = require('express')
const router = new express.Router()
const User = require('../models/userModel')
const {sendWelcomeEmail,sendCancelationEmail} = require('../emails/account')
const auth = require('../middleware/auth')


//signup user
router.post('/register',async (req,res)=>{
    const user = new User(req.body)

    try{

        await user.save()
        sendWelcomeEmail(user.email,user.username);
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})


    }
    catch(error)
    {
        console.log(error.message);
        res.status(400).send(error)
    }
    
})


//login user
router.post('/login',async (req,res) => {
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        if(!user)
        {
            
            res.status(404).send({ message:"Invalid User"})
            return
        }
        const token = await user.generateAuthToken()
        res.send({ user , token})
    }
    catch(error)
    {
        console.log(error.message);
        res.status(400).send(error.message)
    }
      
})


//logout user
router.post('/logout',auth,async (req,res) => {
    try{
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token
            })

            await req.user.save()
            sendCancelationEmail(requser.email,req.user.username);
            res.send()
    }
    catch(e){
        res.status(500).send()
    }
})




module.exports = router