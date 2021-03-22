const Like = require('../models').likes
const jwt = require('jsonwebtoken')
module.exports = {
    create: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (
                    async () => {
                        await Like.create({UserId: data.Id, ItemId: req.body.itemId})
                        let likesResult = await Like.findAndCountAll({
                            where: {ItemId: req.body.itemId}
                        })
                        res.json(likesResult.count)
                    }
                )()
            }
        })
    },
    isExist: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (
                    async () => {
                        let likeResult = await Like.findOne({where: {ItemId: req.body.itemId, UserId: data.Id}})
                        if (likeResult === null) {
                            res.sendStatus(404)
                        } else {
                            res.sendStatus(200)
                        }
                    }
                )()

            }
        })

    },
    remove: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (
                    async () => {
                        await Like.destroy({where: {UserId: data.Id, ItemId: req.body.itemId}})
                        let likesResult = await Like.findAndCountAll({
                            where: {ItemId: req.body.itemId}
                        })
                        res.json(likesResult.count)

                        res.sendStatus(200)
                    }
                )()
            }
        })
    }
}