const  Collection = require('./collection')

module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('Item',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            Status: {type: Sequelize.STRING, allowNull: false},
            Description: {type: Sequelize.STRING, allowNull: false},
            PathToImg: {type: Sequelize.STRING, allowNull: false},
            CollectionId: {type: Sequelize.INTEGER, allowNull: false, references: {model: Collection(Sequelize,sequelize), key: 'Id'}}
        },
        {
            sequelize,
            tableName: 'Item',
            timestamps: false
        })
}