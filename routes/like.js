const express = require('express')
const likeController = require('../controllers/like.js')

const homeRouter = express.Router();
homeRouter.get('/',likeController.getLike)
module.exports=homeRouter