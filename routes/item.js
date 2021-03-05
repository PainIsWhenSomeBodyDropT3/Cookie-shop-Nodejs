const express = require('express')
const itemController = require('../controllers/item.js')

const homeRouter = express.Router();
homeRouter.get('/',itemController.getItem)
module.exports=homeRouter