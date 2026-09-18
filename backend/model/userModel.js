const {DataTypes}=require('sequelize')
const sequelize=require('../config/dbconfig')

const userModel=sequelize.define('user',{
    userID:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true
},
name:{
    type:DataTypes.STRING,
    allowNull:false
},
email:{
    type:DataTypes.STRING,
    allowNull:false
},
password:{
    type:DataTypes.STRING,
    allowNull:false
}
},
{
    tableName:'user',
    timestamps:false
}
)

module.exports=userModel;