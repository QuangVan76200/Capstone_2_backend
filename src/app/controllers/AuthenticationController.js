const authenticationModel = require('../models/AuthenticationModel')
const ownerModel =require('../models/OwnerModel');
const jwt = require('jsonwebtoken');
const argon =require('argon2');
const firebase =require('../../config/firebase')
class AuthenticationController{

    //POST api/Authentication/login
    async login(request,response){
        const {phoneNumber,password}=request.body;
        if(!phoneNumber ||!password)
            return response.json({
                success:false,
                message:'Số điện thoại hoặc mật khẩu đang để trống'
            })
        else{
            try {
                const authentication = await authenticationModel.findOne({phoneNumber:[phoneNumber,"0"+phoneNumber.slice(3,phoneNumber.length)]});
                if(!authentication)
                    return response.json({
                        success:false,
                        message:'Số điện thoại chưa được đăng ký'
                    })
                else{
                    const verifyPassword = await argon.verify(authentication.password,password);
                    if(!verifyPassword)
                        return response.json({
                            success:false,
                            message:'Mật khẩu không chính xác'
                        })
                    const owner = await ownerModel.findOne({idNumber:authentication._id});
                    const token =await  jwt.sign({
                        _id:owner._id
                    },process.env.ACCESS_TOKEN_SECRET);
                    return response.json({
                        success:true,
                        token,
                        owner:{
                            _id:owner._id,
                            phoneNumber:authentication.phoneNumber,
                            firstName:owner.firstName,
                            lastName:owner.lastName,
                            dateOfBirth:new Date(owner.dateOfBirth).toISOString().slice(0,-14),
                            gender:owner.gender,
                            image:process.env.API_URL+owner.image,
                            street:owner.street,
                            city:owner.city,
                            district:owner.district,
                            ward:owner.ward
                        },
                        message:'Đăng nhập thành công'
                    })
                }
            } catch (error) {
                return response.json({
                    success:false,
                    message:'Lỗi mạng'
                })
            }
        }
    }
    //POST api/Authentication/
    async checkToken(request,response)
    {
        try {
            const owner = await ownerModel.findOne({_id:request._id}).populate('idNumber');
            if(owner)
                return response.json({
                    success:true,
                    owner:{
                        _id:owner._id,
                        phoneNumber:owner.idNumber.phoneNumber,
                        firstName:owner.firstName,
                        lastName:owner.lastName,
                        dateOfBirth:new Date(owner.dateOfBirth).toISOString().slice(0,-14),
                        gender:owner.gender,
                        image:process.env.API_URL+owner.image,
                        street:owner.street,
                        city:owner.city,
                        district:owner.district,
                        ward:owner.ward
                    }
                })
            else
                return response.json({
                    success:false,
                    message:'Tài khoản không tồn tại'
                })
        } catch (error) {
            return response.json({
                success:false,
                message:'Lỗi kết nối'
            })
        }
    }
    //POST api/Authentication/check
    async checkExists(request,response){
        const {
            phoneNumber,
            password
        }=request.body;
        if(!phoneNumber || !password){
            return response.json({
                success:false,
                message:'Số điện thoại hoặc mật khẩu đang để trống'
            })
        }else{
            try {
                const authentication = await authenticationModel.findOne({phoneNumber});
                if(authentication)
                    return response.json({
                        success:false,
                        message:'Số điện thoại đã được đang ký'
                    })
                else
                    return response.json({
                        success:true,
                        message:'Số điện thoại có thể đăng ký được'
                    })
            } catch (error) {
                return response.json({
                    success:false,
                    message:'Lỗi mạng'
                })
            }
        }
    }
    //POST api/Authentication/register
    async register(request,response){
        const {
            phoneNumber,
            password,
            firstName,
            lastName,
            dateOfBirth,
            cmnd,
            gender,
            street,
            city,
            district,
            ward
        }=request.body;
        if(!phoneNumber || !password)
            return response.json({
                success:false,
                message:'Số điện thoại hoặc mật khẩu đang để trống'
            })
        try {
            
            const hashPassword = await argon.hash(password);
            const authentication = await authenticationModel.findOne({phoneNumber});
            
                if(authentication)
                    return response.json({
                        success:false,
                        message:'Số điện thoại đã được đang ký'
                    })
            
            const newAuthenticaiton = new authenticationModel({
                phoneNumber,
                password:hashPassword
            });
            await newAuthenticaiton.save();
    
            const owner = new ownerModel({
                firstName,
                lastName,
                dateOfBirth,
                gender,
                cmnd,
                street,
                city,
                district,
                ward,
                image:'/images/owner/616938d4c3e6e3673b2b808c.jpg',
                idNumber: newAuthenticaiton._id
            });
            await owner.save();
            return response.json({
                success:true,
                message:'Đăng ký thành công',
                owner :{
                    phoneNumber,
                    firstName,
                    lastName,
                    dateOfBirth,
                    gender,
                    cmnd,
                    street,
                    city,
                    district,
                    ward
                }
            })
        } catch (error) {
            // return response.json({
            //     success:false,
            //     message:'Lỗi mạng'
            // })
            console.log(error.toString())
        }

    }



    
}

module.exports= new AuthenticationController;

