const express = require('express')
const itemController = require('../controllers/item.js')
const jwt = require('../jwt/jwt')

const homeRouter = express.Router();
homeRouter.get('/allForUsers',itemController.getAll)
homeRouter.post('/create',jwt.verifyToken,itemController.create)
homeRouter.put('/update',jwt.verifyToken,itemController.update)
homeRouter.delete('/remove',jwt.verifyToken,itemController.remove)
homeRouter.get('/all/:token',itemController.getAllUser)

//homeRouter.get('/:token',itemController.get)
module.exports=homeRouter