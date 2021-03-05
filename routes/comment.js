const express = require('express')
const commentController = require('../controllers/comment.js')

const homeRouter = express.Router();
homeRouter.get('/',commentController.getComment)
module.exports=homeRouter