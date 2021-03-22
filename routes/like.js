const express = require('express')
const likeController = require('../controllers/like.js')
const jwt = require('../jwt/jwt')

const homeRouter = express.Router();
homeRouter.post('/create',jwt.verifyToken,likeController.create)
homeRouter.post('/isExist',jwt.verifyToken,likeController.isExist)
homeRouter.delete('/delete',jwt.verifyToken,likeController.remove)
module.exports=homeRouter