module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('UserRole',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            Role: {type: Sequelize.STRING, allowNull: false},
        },
        {
            sequelize,
            tableName: 'UserRole',
            timestamps: false
        })
}