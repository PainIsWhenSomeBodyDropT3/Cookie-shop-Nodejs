const itemTags = require('../models').itemTags
module.exports={
    create : async (req,res)=>{
       let result = await itemTags.create(req.body)
        if(result){
            res.json(result.dataValues)
        }else{
            res.sendStatus(500)
        }
    }
}