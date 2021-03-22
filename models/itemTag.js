const  Item = require('./item')
const  Tag = require('./tag')

module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('ItemTag',{
            ItemId: {type: Sequelize.INTEGER, allowNull: false, references: {model: Item(Sequelize,sequelize), key: 'Id'}},
            TagId: {type: Sequelize.INTEGER, allowNull: false, references: {model: Tag(Sequelize,sequelize), key: 'Id'}}
        },
        {
            sequelize,
            tableName: 'ItemTag',
            timestamps: false
        })
}