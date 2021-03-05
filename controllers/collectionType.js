const collectionType = require('../models').collectionType
module.exports = {
    get: async (req, res) => {
        let isExist = await collectionType.findOne({where: {Type: req.params.type}})
        if(isExist.length!==0){
            console.log(isExist)
            res.json(isExist[0].dataValues)
        }else{
            res.sendStatus(404)
        }
    },
    getAll: async (req, res) => {
       // console.log('\n\n\n\n\n here \n\n\n\n\n')
        let result = await collectionType.findAll()
        //console.log(result)
        // console.log(result)
        /*if(result.length!==0){
            res.json(result[0].dataValues)
        }else{
            res.json('')
        }*/

    }
}