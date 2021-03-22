const Item = require('../models').items
const ItemTag = require('../models').itemTags
const Tag = require('../models').tags
const Likes = require('../models').likes
const Collections = require('../models').collections
const CollectionType = require('../models').collectionType
const Users = require('../models').users
const Comments = require('../models').comments
const jwt = require('jsonwebtoken')
module.exports = {
    create: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (async () => {
                        let result = await Item.create(req.body)
                        if (result) {
                            res.json(result.dataValues)
                        } else {
                            res.sendStatus(500)
                        }
                    }
                )()
            }
        })
    },
    update: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (async () => {
                    let newItem = {
                        Status: req.body.status,
                        Description: req.body.text,
                        PathToImg: req.body.PathToImg,
                        CollectionId: req.body.user_collection_list,
                    }
                    if (req.body.image && newItem.PathToImg === 'v1614426855/uncknown_awk8cb.jpg') {
                        newItem.PathToImg = req.body.image
                    }
                    for (let i = 0; i < req.body.tags.length; i++) {
                        await ItemTag.destroy({where: {ItemId: req.body.itemId}})
                    }
                    await Item.update(newItem, {where: {Id: req.body.itemId}})
                    for (let i = 0; i < req.body.tags.length; i++) {
                        await ItemTag.create({ItemId: req.body.itemId, TagId: req.body.tags[i]})
                    }
                    if (req.body.comments) {
                        let commentResult = await Comments.findAll({where: {ItemId: req.body.itemId}})
                        await Comments.destroy({where: {ItemId: req.body.itemId}})
                        if (commentResult.length !== 0) {
                            for (let i = 0; i < commentResult.length; i++) {
                                let comment = commentResult[i].dataValues
                                await Comments.create(
                                    comment
                                )
                            }
                            for (let i = commentResult.length; i < req.body.comments.length; i++) {
                                let comment = req.body.comments[i];
                                await Comments.create({
                                    UserId: req.body.user_id,
                                    ItemId: req.body.itemId,
                                    Date: comment.date,
                                    Text: comment.text
                                })
                            }

                        } else {
                            for (let i = 0; i < req.body.comments.length; i++) {
                                let comment = req.body.comments[i];
                                await Comments.create({
                                    UserId: req.body.user_id,
                                    ItemId: req.body.itemId,
                                    Date: comment.date,
                                    Text: comment.text
                                })
                            }
                        }
                    }
                    res.sendStatus(200)
                })()
            }
        })
    },
    remove: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (async () => {
                    await ItemTag.destroy({where: {ItemId: req.body.id}})
                    await Likes.destroy({where: {ItemId: req.body.id}})
                    await Comments.destroy({where: {ItemId: req.body.id}})
                    await Item.destroy({where: {Id: req.body.id}})
                    res.sendStatus(200)
                })()
            }
        })

    },
    getAllUser: async (req, res) => {
        jwt.verify(req.params.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                // res.json(data)
                (
                    async () => {
                        let finalJsonData = []
                        let collectionResult = await Collections.findAll({where: {UserId: data.Id}})
                        for (let i = 0; i < collectionResult.length; i++) {

                            let collection = collectionResult[i].dataValues
                            let itemResult = await Item.findAll({where: {CollectionId: collection.Id}})

                            for (let x = 0; x < itemResult.length; x++) {

                                let jsonItem = {
                                    id: '',
                                    itemId: '',
                                    image: '',
                                    status: '',
                                    user_id: '',
                                    user_collection_list: '',
                                    text: '',
                                    tags: [],
                                    comments: [],
                                    likes: ''
                                }

                                let item = itemResult[x].dataValues
                                let tagsResult = await ItemTag.findAll({
                                    include: [
                                        {model: Tag}
                                    ],
                                    where: {ItemId: item.Id}
                                })
                                let tags = []
                                for (let y = 0; y < tagsResult.length; y++) {
                                    let tag = tagsResult[y].dataValues
                                    tags.push(tag.Tag.Id)
                                }
                                let commentResult = await Comments.findAll({
                                    where: {ItemId: item.Id},
                                })
                                let comments = []
                                for (let y = 0; y < commentResult.length; y++) {
                                    let comment = commentResult[y].dataValues
                                    let date =
                                        comment.Date.getFullYear() + '-' +
                                        (comment.Date.getMonth() + 1) + '-' +
                                        comment.Date.getDate() + ' ' +
                                        comment.Date.getHours() + ':' +
                                        comment.Date.getMinutes()
                                    comments.push({
                                        id: comment.Id,
                                        user_id: comment.UserId,
                                        date: date,
                                        text: comment.Text
                                    })
                                }
                                let likesResult = await Likes.findAndCountAll({
                                    where: {ItemId: item.Id}
                                })

                                jsonItem.id = item.Id
                                jsonItem.itemId = item.Id
                                jsonItem.image = item.PathToImg
                                jsonItem.status = item.Status
                                jsonItem.user_id = data.Id
                                jsonItem.user_collection_list = collection.Id
                                jsonItem.text = item.Description
                                jsonItem.tags = tags
                                jsonItem.comments = comments
                                jsonItem.likes = likesResult.count
                                finalJsonData.push(jsonItem)
                            }
                        }
                        res.json(finalJsonData)
                    }
                )()
            }
        })
    },
    getAll: async (req, res) => {

        let finalJsonData = []
        let collectionResult = await Collections.findAll()
        for (let i = 0; i < collectionResult.length; i++) {

            let collection = collectionResult[i].dataValues
            let itemResult = await Item.findAll({where: {CollectionId: collection.Id}})

            for (let x = 0; x < itemResult.length; x++) {

                let jsonItem = {
                    id: '',
                    itemId: '',
                    image: '',
                    status: '',
                    user_id: '',
                    user_collection_list: '',
                    text: '',
                    tags: [],
                    comments: [],
                    likes: ''
                }
                let item = itemResult[x].dataValues
                let tagsResult = await ItemTag.findAll({
                    include: [
                        {model: Tag}
                    ],
                    where: {ItemId: item.Id}
                })
                let tags = []
                for (let y = 0; y < tagsResult.length; y++) {
                    let tag = tagsResult[y].dataValues
                    tags.push(tag.Tag.Id)
                }
                let commentResult = await Comments.findAll({
                    where: {ItemId: item.Id},
                })
                let comments = []
                for (let y = 0; y < commentResult.length; y++) {
                    let comment = commentResult[y].dataValues
                    let date =
                        comment.Date.getFullYear() + '-' +
                        (comment.Date.getMonth() + 1) + '-' +
                        comment.Date.getDate() + ' ' +
                        comment.Date.getHours() + ':' +
                        comment.Date.getMinutes()
                    comments.push({
                        id: comment.Id,
                        user_id: comment.UserId,
                        date: date,
                        text: comment.Text
                    })
                }
                let likesResult = await Likes.findAndCountAll({
                    where: {ItemId: item.Id}
                })

                jsonItem.id = item.Id
                jsonItem.itemId = item.Id
                jsonItem.image = item.PathToImg
                jsonItem.status = item.Status
                jsonItem.user_id = collection.UserId
                jsonItem.user_collection_list = collection.Id
                jsonItem.text = item.Description
                jsonItem.tags = tags
                jsonItem.comments = comments
                jsonItem.likes = likesResult.count

                finalJsonData.push(jsonItem)
            }
        }
        res.json(finalJsonData)
    }
}