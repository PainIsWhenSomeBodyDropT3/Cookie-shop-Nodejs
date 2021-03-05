const  User = require('./user')
const  Item = require('./item')

module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('Like',{
            ItemId: {type: Sequelize.INTEGER, allowNull: false, references: {model: Item(Sequelize,sequelize), key: 'Id'}},
            UserId: {type: Sequelize.INTEGER, allowNull: false, references: {model: User(Sequelize,sequelize), key: 'Id'}}
        },
        {
            sequelize,
            tableName: 'Like',
            timestamps: false
        })
}