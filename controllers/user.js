const User = require('../models').users
const Collection = require('../models').collections
const Item = require('../models').items
const ItemTag = require('../models').itemTags
const Like = require('../models').likes
const Comment = require('../models').comments
const CollectionType = require('../models').collectionType
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ADMIN = 1;
const REGISTERED = 2;

module.exports = {
    getByToken: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (
                    async () => {
                        let isRegistered = await User.findOne({where: {Login: data.Login}})
                        if (isRegistered) {
                            res.json(data)
                        } else {
                            res.sendStatus(403)
                        }
                    }
                )()

            }
        })
    }
    ,
    register: async (req, res) => {
        let newUser = {
            Login: req.body.login,
            Password: req.body.password,
            PathToImg: req.body.pathToImg,
            UserRoleId: REGISTERED
        }
        bcrypt.hash(newUser.Password, 10, async function (err, hash) {
            if (err) {
                res.status(500).send('Error with password hash')
            } else {
                newUser.Password = hash;
                await User.create(newUser)
                res.status(200).send('User registration success')
            }
        })
    }
    ,
    isRegister: async (req, res) => {
        let login = req.body.login;
        let isRegistered = await User.findOne({where: {Login: login}})
        if (isRegistered) {
            res.status(409).send('This user already registered')
        } else {
            res.status(200).send('Success')
        }
    },
    getActive: async (req, res) => {
        jwt.verify(req.params.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.json({id: data.Id, value: data.Login, image: data.PathToImg})
            }
        })

    },
    getWithFullImgPath: async (req, res) => {
        jwt.verify(req.params.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                res.json({
                    id: data.Id,
                    value: data.Login,
                    image: 'https://res.cloudinary.com/ivanverigo2000/image/upload/' + data.PathToImg
                })
            }
        })
    },

    getAll: async (req, res) => {
        let users = []
        let userResult = await User.findAll({where: {}})
        if (userResult) {
            for (let i = 0; i < userResult.length; i++) {

                let user = {
                    id: userResult[i].dataValues.Id,
                    value: userResult[i].dataValues.Login,
                    image: 'https://res.cloudinary.com/ivanverigo2000/image/upload/' + userResult[i].dataValues.PathToImg,
                }
                users.push(user)
            }
            res.json(users)
        } else {
            res.sendStatus(500)
        }
    },
    getAllForAdmin: async (req, res) => {
        let userResult = await User.findAll({
            include: [
                {
                    model: Collection, include: [
                        {
                            model: Item, include: [
                                {
                                    model: ItemTag
                                },
                                {
                                    model: Like
                                },
                                {
                                    model: Comment
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        let users = []
        /* users.push({
                id: user.Id,
                login: user.Id,
                collections:user.Collections,
                items:,
                tags:,
                comments:,
                likes:,
            })*/
        for (let i = 0; i < userResult.length; i++) {
            let user = userResult[i].dataValues;
            let likes = 0, comments = 0, tags = 0, items = 0
            for (let y = 0; y < user.Collections.length; y++) {
                let collection = user.Collections[y]
                for (let z = 0; z < collection.Items.length; z++) {
                    let item = collection.Items[z]
                    items++
                    likes += item.Likes.length
                    comments += item.Comments.length
                    tags += item.ItemTags.length
                }
            }
            users.push({
                id: user.Id,
                login: user.Login,
                collections: user.Collections.length,
                items: items,
                tags: tags,
                comments: comments,
                likes: likes,
            })
        }
        res.json(users)
    },
    login: async (req, res) => {
        let login = req.body.login;
        let password = req.body.password;
        let isRegistered = await User.findOne({where: {Login: login}})

        if (isRegistered) {
            bcrypt.compare(password, isRegistered.Password, (err, result) => {
                if (result) {
                    jwt.sign(isRegistered.dataValues, 'secretkey', (err, token) => {
                        res.status(200).json(token)
                    })
                } else {
                    res.status(404).send('User not found')
                }
            })

        } else {
            res.status(404).send('User not found')
        }
    },
    deleteUser: async (req, res) => {
        let userResult = await User.findAll({
            where:{Id:req.params.id},
            include: [
                {
                    model: Collection, include: [
                        {
                            model: Item, include: [
                                {
                                    model: ItemTag
                                },
                                {
                                    model: Like
                                },
                                {
                                    model: Comment
                                }
                            ]
                        }
                    ]
                }
            ]
        });
        for (let i = 0; i < userResult.length; i++) {
            let user = userResult[i].dataValues;
            for (let y = 0; y < user.Collections.length; y++) {
                let collection = user.Collections[y]
                for (let z = 0; z < collection.Items.length; z++) {
                    let item = collection.Items[z]
                    await Like.destroy({where:{ItemId:item.Id}})
                    await Comment.destroy({where:{ItemId:item.Id}})
                    await ItemTag.destroy({where:{ItemId:item.Id}})
                    await Item.destroy({where:{Id:item.Id}})
                }
                await Collection.destroy({where:{Id:collection.Id}})
            }
        }
       let result =  await  User.destroy({where:{Id:req.params.id}})
        if(result){
            res.sendStatus(200)
        }else {
            res.sendStatus(500)
        }

    },
    getCollection: async (req, res) => {
        jwt.verify(req.token, 'secretkey', (err, data) => {
            if (err) {
                res.sendStatus(403)
            } else {
                (
                    async () => {
                        let result = await Collection.findAll(
                            {
                                include: [
                                    {
                                        model: CollectionType, where: {Type: req.params.type}, attributes: []
                                    },
                                    {
                                        model: User, where: {Id: data.Id}, attributes: []
                                    }
                                ],
                                order: [
                                    ['Id', 'DESC'],
                                ],
                            }
                        )
                        let response_data = []
                        for (let i = 0; i < result.length; i++) {
                            response_data.push(result[i].dataValues)
                        }
                        if (result.length !== 0) {
                            res.json(response_data)
                        } else {
                            res.json('')
                        }
                    }
                )()

            }
        })

    },

}