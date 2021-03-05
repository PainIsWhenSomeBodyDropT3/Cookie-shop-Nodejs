const Collection = require('../models').collections
const CollectionType = require('../models').collectionType

module.exports={
    getCollection : async (req,res)=>{

       let result = await Collection.findAll(
           {
               include:[
               {model:CollectionType, where:{Type:req.params.type},attributes:[]}
               ]})
       // console.log(result)
        if(result.length!==0){
            res.json(result[0].dataValues)
        }else{
            res.json('')
        }

    },
    isExist : async (req,res)=>{

       let name = req.body.name
        let isRegistered = await Collection.findOne({where: {Name: name}})

        if(isRegistered){
           res.sendStatus(200)
        }else{
            res.sendStatus(404)
        }

    },

}