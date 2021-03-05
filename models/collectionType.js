module.exports =(Sequelize , sequelize)=>{
    return sequelize.define('CollectionType',{
            Id: {type: Sequelize.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true},
            Type: {type: Sequelize.STRING, allowNull: false},
        },
        {
            sequelize,
            tableName: 'CollectionType',
            timestamps: false
        })
}