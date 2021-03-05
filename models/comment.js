const  User = require('./user')
module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('Comment',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            UserId: {type: Sequelize.INTEGER, allowNull: false, references: {model: User(Sequelize,sequelize), key: 'Id'}},
            ItemId: {type: Sequelize.INTEGER, allowNull: false, references: {model: User(Sequelize,sequelize), key: 'Id'}},
            Date: {type: Sequelize.DATE, allowNull: false},
            Text: {type: Sequelize.STRING, allowNull: false}
        },
        {
            sequelize,
            tableName: 'Comment',
            timestamps: false
        })
}