module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('Tag',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            Value: {type: Sequelize.STRING, allowNull: false},
        },
        {
            sequelize,
            tableName: 'Tag',
            timestamps: false
        })
}