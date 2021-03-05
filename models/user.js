const UserRole = require('./userRole')
module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('User',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            Login: {type: Sequelize.STRING, allowNull: false},
            Password: {type: Sequelize.STRING, allowNull: false},
            PathToImg: {type: Sequelize.STRING, allowNull: false},
            UserRoleId: {type: Sequelize.INTEGER, allowNull: false, references: {model: UserRole(Sequelize,sequelize), key: 'Id'}}
        },
        {
            sequelize,
            tableName: 'User',
            timestamps: false
        })
}