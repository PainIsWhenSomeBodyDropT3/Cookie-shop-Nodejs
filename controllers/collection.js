const Collection = require('../models').collections
const Item = require('../models').items
const ItemTag = require('../models').itemTags
const Likes = require('../models').likes
const Comments = require('../models').comments
const User = require('../models').users
const CollectionType = require('../models').collectionType
const jwt = require('jsonwebtoken')

module.exports = {
    getCollection: async (req, res) => {

        let result = await Collection.findAll(
            {
                include: [
                    {model: CollectionType, where: {Type: req.params.type}, attributes: []}
                ],
                order: [
                    ['Id', 'DESC'],
                ],
            })

        let data = []
        for (let i = 0; i < result.length; i++) {
            data.push(result[i].dataValues)
        }
        if (result.length !== 0) {
            res.json(data)
        } else {
            res.json('')
        }

    },
    getUserCollections: async (req, res) => {

        jwt.verify(req.params.token, 'secretkey', (err, data) => {

            if (err) {
                res.sendStatus(403)
            } else {
                (
                    async () => {
                        let type = req.params.type.toUpperCase()
                        type = type.substring(0, type.length - 1)
                        let result = await Collection.findAll(
                            {
                                include: [
                                    {
                                        model: CollectionType, where: {Type: type}, attributes: []
                                    },
                                    {
                                        model: User, where: {Id: data.Id}, attributes: []
                                    }
                                ],
                            })

                        let resp = []

                        for (let i = 0; i < result.length; i++) {
                            resp.push({id:result[i].dataValues.Id,value:result[i].dataValues.Name})
                        }
                        if (result.length !== 0) {
                             res.json(resp)
                        } else {
                            res.json('')
                        }
                    }
                )();

            }
        })


    },
    isExist: async (req, res) => {

        let name = req.body.name
        let isRegistered = await Collection.findOne({where: {Name: name}})

        if (isRegistered) {
            res.sendStatus(200)
        } else {
            res.sendStatus(404)
        }

    },
    create: async (req, res) => {

        let newCollection = req.body;
        let result = await Collection.create(newCollection);
        if (result) {
            res.json(result.dataValues)
        } else {
            res.sendStatus(500)
        }

    },
    update: async (req, res) => {
        let newCollection = {
            Name: req.body.Name,
            Description: req.body.Description,
            PathToImg: req.body.PathToImg,
            UserId: req.body.UserId,
        }
        let result = await Collection.update(newCollection, {where: {Id: req.body.Id}})
        if (result) {
            let updatedCollection = await Collection.findOne({where: {Id: req.body.Id}})
            if (updatedCollection) {
                res.json(updatedCollection.dataValues)
            } else {
                res.sendStatus(404)
            }
        } else {
            res.sendStatus(500)
        }
    },
    delete: async (req, res) => {
        let itemResult = await Item.findAll({where:{CollectionId:req.body.Id}})

        for (let i = 0 ;  i < itemResult.length ; i++){
            let item = itemResult[i].dataValues;
            await ItemTag.destroy({where:{ItemId:item.Id}})
            await Likes.destroy({where:{ItemId:item.Id}})
            await Comments.destroy({where:{ItemId:item.Id}})
        }

        await  Item.destroy({where:{CollectionId:req.body.Id}})

        let result = await Collection.destroy({where: {Id: req.body.Id}})

        if (result) {
            res.sendStatus(200)
        } else {
            res.sendStatus(500)
        }
    }

}