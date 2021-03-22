const express = require('express')
const collectionController = require('../controllers/collection')
const jwt = require('../jwt/jwt')
const homeRouter = express.Router();
homeRouter.get('/:type',collectionController.getCollection)
homeRouter.get('/:type/:token',collectionController.getUserCollections)
homeRouter.post('/isExist',jwt.verifyToken,collectionController.isExist)
homeRouter.post('/create',jwt.verifyToken,collectionController.create)
homeRouter.put('/update',jwt.verifyToken,collectionController.update)
homeRouter.delete('/destroy',jwt.verifyToken,collectionController.delete)
module.exports=homeRouter
