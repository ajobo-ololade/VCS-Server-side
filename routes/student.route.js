const express = require('express')
const router = express.Router()
const studentController = require('../controllers/student.controller')
router.post('/signup',studentController.displaySignup)
router.post('/signin',studentController.displaySignin)

module.exports=router