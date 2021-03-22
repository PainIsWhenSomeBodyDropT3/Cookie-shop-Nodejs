const Sequalize = require('sequelize')
const bcrypt = require('bcrypt')
const sequelize = new Sequalize("CollectionManagement", "postgres", "18051965qQ", {
    dialect: "postgres",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const userRoles = require('./userRole')(Sequalize,sequelize);

const collectionType = require('./collectionType')(Sequalize,sequelize);

const users= require('./user')(Sequalize,sequelize);
const collections= require('./collection')(Sequalize,sequelize);
const items= require('./item')(Sequalize,sequelize);
const comments= require('./comment')(Sequalize,sequelize);
const likes= require('./like')(Sequalize,sequelize);
const tags= require('./tag')(Sequalize,sequelize);
const itemTags= require('./itemTag')(Sequalize,sequelize);

userRoles.hasMany(users ,{  onDelete: 'cascade' ,  onUpdate: 'cascade' });
users.belongsTo(userRoles);

users.hasMany(collections,{  onDelete: 'cascade' ,  onUpdate: 'cascade' })
collections.belongsTo(users)

collectionType.hasMany(collections,{  onDelete: 'cascade' ,  onUpdate: 'cascade' })
collections.belongsTo(collectionType)

collections.hasMany(items,{  onDelete: 'cascade' ,  onUpdate: 'cascade' })
items.belongsTo(collections)

items.hasMany(comments,{  onDelete: 'cascade' ,  onUpdate: 'cascade' })
comments.belongsTo(items)

items.hasMany(itemTags,{  onDelete: 'cascade' ,  onUpdate: 'cascade' })
itemTags.belongsTo(items)

tags.hasMany(itemTags,{  onDelete: 'cascade' ,  onUpdate: 'cascade' })
itemTags.belongsTo(tags)

items.hasMany(likes,{ onDelete: 'cascade' ,  onUpdate: 'cascade'})
likes.belongsTo(items)

users.hasMany(likes,{ onDelete: 'cascade' ,  onUpdate: 'cascade' })
likes.belongsTo(users)

users.hasMany(comments,{ onDelete: 'cascade' ,  onUpdate: 'cascade' })
comments.belongsTo(users)


/*sequelize.sync({
    force:true
}).then(()=>{
    console.log('con')
    userRoles.findAll().then((result)=>{
        if(result.length===0){
            userRoles.create({Role:'ADMIN'})
            userRoles.create({Role:'REGISTERED'})
        }
    });
    users.findAll().then(result=>{
        if(result.length===0){
            bcrypt.hash('admin', 10, async function (err, hash) {
                    users.create({Login:'admin' ,PathToImg:'v1614426855/uncknown_awk8cb.jpg' ,Password:hash , UserRoleId : 1})
            })
            bcrypt.hash('test', 10, async function (err, hash) {
                for(let i = 0 ;  i < 50 ; i ++) {
                    users.create({
                        Login: 'test'+i,
                        PathToImg: 'v1614426855/uncknown_awk8cb.jpg',
                        Password: hash,
                        UserRoleId: 2
                    })
                }
            })
        }
    })
    collectionType.findAll().then((result)=>{
        if(result.length===0){
            collectionType.create({Type:'BOOK'})
            collectionType.create({Type:'DRINK'})
            collectionType.create({Type:'GAME'})
            collectionType.create({Type:'OTHER'})

        }
    })
    tags.findAll().then((result)=>{
        if(result.length===0){
            tags.create({Value:'new'})
            tags.create({Value:'rebuild'})
            tags.create({Value:'best'})
            tags.create({Value:'2021'})
            tags.create({Value:'old but good'})
            tags.create({Value:'nice'})
            tags.create({Value:'10'})
            tags.create({Value:'=)'})
            tags.create({Value:'=('})

        }
    })
}).catch(e=>{
    console.log(e)
})*/
module.exports={
    tags:tags,
    userRoles:userRoles,
    collectionType:collectionType,
    users:users,
    collections:collections,
    items:items,
    comments:comments,
    likes:likes,
    itemTags:itemTags,



    sequelize,
    Sequalize,
}

