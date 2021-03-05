const express = require('express')
const collectionController = require('../controllers/collection')

const homeRouter = express.Router();
homeRouter.get('/:type',collectionController.getCollection)
homeRouter.post('/isExist',collectionController.isExist)
module.exports=homeRouter
