const collectionType = require('../models').collectionType
module.exports = {
    get: async (req, res) => {
        let isExist = await collectionType.findOne({where: {Type: req.params.type}})
        if(isExist.length!==0){
            res.json(isExist.dataValues)
        }else{
            res.sendStatus(404)
        }
    },
    getAll: async (req, res) => {
        let result = await collectionType.findAll()

    }
}