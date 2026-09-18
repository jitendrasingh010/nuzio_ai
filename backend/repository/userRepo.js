const {userModel} =require('../model/index')

exports.findByemailId=async(email)=>{
    return await userModel.findOne({where:{email}})
}
exports.createUser=async(userdata)=>{
    return await userModel.create(userdata)
}