const express = require('express')
const itemTagController = require('../controllers/itemTag.js')

const homeRouter = express.Router();
homeRouter.post('/create',itemTagController.create)
module.exports=homeRouter