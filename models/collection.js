const  User = require('./user')
const  CollectionType = require('./collectionType')
module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('Collection',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            Name: {type: Sequelize.STRING, allowNull: false},
            Description: {type: Sequelize.STRING, allowNull: false},
            PathToImg: {type: Sequelize.STRING, allowNull: false},
            UserId: {type: Sequelize.INTEGER, allowNull: false, references: {model: User(Sequelize,sequelize), key: 'Id'}},
            CollectionTypeId: {type: Sequelize.INTEGER, allowNull: false, references: {model: CollectionType(Sequelize,sequelize), key: 'Id'}}
        },
        {
            sequelize,
            tableName: 'Collection',
            timestamps: false
        })
}