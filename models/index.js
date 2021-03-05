const Sequalize = require('sequelize')

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

userRoles.hasMany(users);
users.belongsTo(userRoles);

users.hasMany(collections)
collections.belongsTo(users)

collectionType.hasMany(collections)
collections.belongsTo(collectionType)

collections.hasMany(items)
items.belongsTo(collections)

items.hasMany(comments)
comments.belongsTo(items)

items.hasMany(likes)
likes.belongsTo(items)

users.hasMany(likes)
likes.belongsTo(users)

users.hasMany(comments)
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
    collectionType.findAll().then((result)=>{
        if(result.length===0){
            collectionType.create({Type:'BOOK'})
            collectionType.create({Type:'DRINK'})
            collectionType.create({Type:'GAME'})
            collectionType.create({Type:'OTHER'})

        }
    })
}).catch(e=>{
    console.log(e)
})*/
module.exports={
    userRoles:userRoles,
    collectionType:collectionType,
    users:users,
    collections:collections,
    items:items,
    comments:comments,
    likes:likes,


    sequelize,
    Sequalize,
}

