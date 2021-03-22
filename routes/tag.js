const express = require('express')
const tagController = require('../controllers/tag.js')

const homeRouter = express.Router();
homeRouter.get('/',tagController.getTags)
module.exports=homeRouter