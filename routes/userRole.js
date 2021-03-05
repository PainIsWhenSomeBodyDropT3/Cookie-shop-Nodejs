const express = require('express')
const userRoleController = require('../controllers/userRole.js')

const homeRouter = express.Router();
homeRouter.get('/',userRoleController.getUserRole)
module.exports=homeRouter