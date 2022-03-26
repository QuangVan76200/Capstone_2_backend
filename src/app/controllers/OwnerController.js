require('dotenv').config();
const fs = require("fs")
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const OwnerModel = require('../models/OwnerModel')


class OwnerController {

    async updateProfile (request,response){
        const userId= request.userId;
        try {
            const ownerUpdated = await OwnerModel.findOneAndUpdate({idNumber:userId},{image:'/images/owner/'+request.file.filename},{new:true});
            if(ownerUpdated)
            return response.json({
                success:true,
                user:ownerUpdated,
                message:'Chỉnh sửa thành công'
            })
            else
                return response.json({
                    success:false,
                    message:'Chỉnh sửa không thành công'
                })
        } catch (error) {
            return response.json({
                success: false,
                message:'Lỗi server'
            })
        }
    }
    async showAll(request,response){
        try {
            const findOwners = await OwnerModel.find({}).populate({path:'idNumber',select:'phoneNumber'})
            const owners =findOwners.map(owner=>{
                return{
                    _id:owner._id,
                    firstName:owner.firstName,
                    lastName:owner.lastName,
                    phoneNumber:owner.idNumber.phoneNumber,
                    dateOfBirth:new Date(owner.dateOfBirth).toISOString().slice(0,-14),
                    gender:owner.gender,
                    image:process.env.API_URL+owner.image,
                    street:owner.street,
                    city:owner.city,
                    district:owner.district,
                    ward:owner.ward
                }
            })
            return response.json({
                success:true,
                owners
            })
        } catch (error) {
            return response.json({
                success:false,
                message:error.toString()
            })
        }
    }
    
}

module.exports = new OwnerController