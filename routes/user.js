const express = require('express')
const userController = require('../controllers/user.js')
const jwt = require('../jwt/jwt')

const homeRouter = express.Router();
homeRouter.post('/getByToken',jwt.verifyToken,userController.getByToken)
homeRouter.post('/register',userController.register)
homeRouter.post('/isRegister',userController.isRegister)
homeRouter.post('/login',userController.login)
homeRouter.get('/collection/:type',jwt.verifyToken,userController.getCollection)
module.exports=homeRouter