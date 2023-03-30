const express = require('express')
const users = require('../controllers/users')
const auth = require('../middleware/author')
const router = new express.Router()

//register
router.post('/Signup', users.register )
//user login 
router.post('/Signin', users.login )
//logout
router.get("/logout", auth, users.logOut)
//logout all devices
router.get("/logoutAll", auth, users.logOutAll)
//send massage for verification
router.post('/verifyMe', auth ,users.verifyMe)
//
router.get('/verify/:id/:token',users.verify)
//get profile
router.get('/profile', auth , users.profile )
// delete user by id 
router.delete('/user/:id', auth , users.deleteUser )


module.exports = router