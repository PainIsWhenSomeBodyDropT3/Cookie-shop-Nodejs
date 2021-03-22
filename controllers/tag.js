const Tag = require('../models').tags
module.exports = {
    getTags: async (req, res) => {
        let result = await Tag.findAll()
        if (result) {
            let resp = []
            for( let i  = 0 ; i< result.length ; i++){
                resp.push({id:result[i].dataValues.Id , value:result[i].dataValues.Value})
            }
           res.json(resp)
        } else {
            res.sendStatus(404)
        }
    }
}