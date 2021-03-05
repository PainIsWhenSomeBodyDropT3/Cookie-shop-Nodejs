const express = require('express')
const collectionTypeController = require('../controllers/collectionType')
const jwt = require('../jwt/jwt')
const homeRouter = express.Router();
homeRouter.get('/:type',collectionTypeController.get)
homeRouter.get('/',jwt.verifyToken,collectionTypeController.getAll)
module.exports=homeRouter
