require('dotenv').config();
const accountModel = require('../models/AccountMode');
const doctorModel = require('../models/DoctorModel');
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const authModel =require('../models/AuthenticationModel');
const OwnerModel = require('../models/OwnerModel');


class AccountController {

    //[POST] /api/Account/register
    async register(request, response, next) {
        const {
            username,
            password,
            firstName,
            lastName,
            dateOfBirth,
            phoneNumber,
            gender,
            zipCode
        } = request.body;
        if (!username || !password)
            return response.json({
                success: false,
                message: 'Missing username and/or password !!!'
            });
        try {
            //check existing username

            const account = await accountModel.findOne({
                username: username
            });
            if (account)
                return response.json({
                    success: false,
                    message: 'Tài Khoản đã tồn tại'
                });
            else{
                const hasedPassword = await argon2.hash(password);//Truongledai =>ákgdsháiugsihưo;aihguig
                const newAccount = new accountModel({
                    username: username,
                    password: hasedPassword,
                });
                await newAccount.save();
                const newDoctor = new doctorModel({
                    firstName,
                    lastName,
                    dateOfBirth,
                    phoneNumber,
                    gender,
                    zipCode,
                    account:newAccount._id
                })
                await newDoctor.save();
                return response.json({
                    success: true,
                    message: 'Đăng ký thành công !',
                    user:{
                        username,
                        firstName,
                        lastName,
                        dateOfBirth,
                        phoneNumber,
                        gender,
                        zipCode
                    }
            })
            }

        } catch (error) {
            return response.json({success:false, message:error});
        }
    }
    //[POST] /api/Account/login
    async login(request, response, next) {
        const {
            username,
            password
        } = request.body;
        if (!username || !password)
            return response.json({
                success: false,
                message : 'Tài Khoản hoặc Mật Khẩu đang để trống '
            });
        try {
            // check user
            const user = await accountModel.findOne({
                username
            });
            if (!user)
            {
                const authentication =await authModel.findOne({phoneNumber:['+84'+username.slice(1),username]})
                if(!authentication)
                    return response.json({
                        success: false,
                        message: 'Tài Khoản hoặc Mật Khẩu không đúng'
                    });
                else{
                    const passwordValid = await argon2.verify(authentication.password, password);
                    if (!passwordValid)
                        return response.json({
                            success: false,
                            message: 'Tài Khoản hoặc Mật Khẩu không đúng'
                        });
                    else
                    {
                        const owner =await OwnerModel.findOne({idNumber:authentication._id})
                        const token = jwt.sign({
                            _id: owner._id
                        }, process.env.ACCESS_TOKEN_SECRET)
                        return response.json({
                            success: true,
                            user:{
                                _id:owner._id,
                                phoneNumber:authentication.phoneNumber,
                                firstName:owner.firstName,
                                lastName:owner.lastName,
                                dateOfBirth:owner.dateOfBirth,
                                phoneNumber:owner.phoneNumber,
                                gender:owner.gender,
                                image:process.env.API_URL+ owner.image,
                                street:owner.street,
                                city:owner.city,
                                district:owner.district,
                                ward:owner.ward,
                                zipCode:owner.zipCode,
                                role:'USER'
                            },
                            token,
                            message: 'Đăng nhập thành công !',
                        })
                    }
                }
            }
            else{
                const passwordValid = await argon2.verify(user.password, password);
                if (!passwordValid)
                    return response.json({
                        success: false,
                        message: 'Tài Khoản hoặc Mật Khẩu không đúng'
                    });

                else{
                    const doctor =await doctorModel.findOne({account:user._id})
                    const token = jwt.sign({
                        _id: doctor._id
                    }, process.env.ACCESS_TOKEN_SECRET)
                    return response.json({
                        success: true,
                        user:{
                            _id:doctor._id,
                            username:user.username,
                            firstName:doctor.firstName,
                            lastName:doctor.lastName,
                            dateOfBirth:doctor.dateOfBirth,
                            phoneNumber:doctor.phoneNumber,
                            gender:doctor.gender,
                            image:process.env.API_URL+ doctor.image,
                            street:doctor.street,
                            city:doctor.city,
                            district:doctor.district,
                            ward:doctor.ward,
                            zipCode:doctor.zipCode,
                            role:user.role
                        },
                        token,
                        message: 'Đăng nhập thành công !',
                    })
                }
            }
        } catch (error) {
            console.log(error.toString())
            return response.json({success:false, message:'Lỗi server'});
        }
    }

    //[GET] /api/Acccount
    //Check if user is logged in
    //@access public 
    async checkToken(request,response,next){
        try {
            const doctor = await doctorModel.findById(request.userId).select('-password');
            if(!doctor)
            {
                const owner = await OwnerModel.findById(request.userId).select('-password');
                if(!owner)
                    return response.json({success:false,messege:'User not found'});
                else{
                    const authentication =await authModel.findOne({_id:owner.idNumber});
                    response.json({
                        success:true,
                        user:{
                            _id:owner._id,
                            phoneNumber:authentication.phoneNumber,
                            firstName:owner.firstName,
                            lastName:owner.lastName,
                            dateOfBirth:owner.dateOfBirth,
                            phoneNumber:owner.phoneNumber,
                            gender:owner.gender,
                            image:process.env.API_URL+ owner.image,
                            street:owner.street,
                            city:owner.city,
                            district:owner.district,
                            ward:owner.ward,
                            zipCode:owner.zipCode,
                            role:'USER'
                        },
                        message:'Kiểm tra token thành công'
                    });
                }
            }
            else{
               
                const account = await accountModel.findOne({_id:doctor.account});
                response.json({
                    success:true,
                    user:{
                        _id:doctor._id,
                        username:account.username,
                        firstName:doctor.firstName,
                        lastName:doctor.lastName,
                        dateOfBirth:doctor.dateOfBirth,
                        phoneNumber:doctor.phoneNumber,
                        gender:doctor.gender,
                        image:process.env.API_URL+ doctor.image,
                        street:doctor.street,
                        city:doctor.city,
                        district:doctor.district,
                        ward:doctor.ward,
                        zipCode:doctor.zipCode,
                        role:account.role
                    },
                    message:'Kiểm tra token thành công'
                });
            }
            
        } catch (error) {
            response.json({success:false,message:'Lỗi Server'});
        }
    }
}

module.exports = new AccountController