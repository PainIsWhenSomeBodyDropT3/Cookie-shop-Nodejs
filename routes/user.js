const express = require('express')
const userController = require('../controllers/user')
const jwt = require('../jwt/jwt')

const homeRouter = express.Router();
homeRouter.post('/getByToken',jwt.verifyToken,userController.getByToken)
homeRouter.post('/register',userController.register)
homeRouter.post('/isRegister',userController.isRegister)
homeRouter.post('/login',userController.login)
homeRouter.get('/all',userController.getAll)
homeRouter.get('/:token',userController.getActive)
homeRouter.get('/fullImgPath/:token',userController.getWithFullImgPath)
homeRouter.get('/collection/:type',jwt.verifyToken ,userController.getCollection)
homeRouter.get('/admin/all',jwt.verifyToken,jwt.verifyAdmin,userController.getAllForAdmin)
homeRouter.delete('/admin/:id',jwt.verifyToken,jwt.verifyAdmin,userController.deleteUser)
module.exports=homeRouter