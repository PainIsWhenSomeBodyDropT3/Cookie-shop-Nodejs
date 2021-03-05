const User = require('../models').users
const Collection = require('../models').collections
const CollectionType = require('../models').collectionType
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const ADMIN = 1;
const REGISTERED = 2;

module.exports = {
    getByToken: async (req, res) => {
       jwt.verify(req.token,'secretkey',(err,data)=>{
           if(err){
               res.sendStatus(403)
           }else {
               res.json(data)
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
    login:async (req, res) => {
        let login = req.body.login;
        let password = req.body.password;
        let isRegistered = await User.findOne({where: {Login: login}})

        if (isRegistered) {
            bcrypt.compare(password, isRegistered.Password, (err, result)=> {
                if(result){
                    jwt.sign(isRegistered.dataValues,'secretkey', (err,token)=>{
                        res.status(200).json(token)
                    })
                }else{
                    res.status(404).send('User not found')
                }
            })

        } else {
            res.status(404).send('User not found')
        }
    },
    getCollection: async (req, res) => {
        jwt.verify(req.token,'secretkey',(err,data)=>{
            if(err){
               res.sendStatus(403)
            }else {
                (
                async ()=>{
                    let result = await Collection.findAll(
                        {
                            include:[
                                {
                                    model:CollectionType, where:{Type:req.params.type},attributes:[]
                                },
                                {
                                    model:User, where:{Id:data.Id},attributes:[]
                                }
                            ]
                        }
                    )
                    if(result.length!==0){
                        res.json(result[0].dataValues)
                    }else{
                        res.json('')
                    }
                }
                )()

            }
        })

    },

}