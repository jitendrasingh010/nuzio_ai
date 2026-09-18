const userService=require('../services/userService')

exports.signup=async(req,res)=>{
    const {name,email,password}=req.body

    if(!name||!email||!password){
        return res.status(400).json({message:'All fields are required'})
    }
    const response=await userService.createuser({name,email,password})
    res.status(201).json({message:'signup successfully',user:response})
}