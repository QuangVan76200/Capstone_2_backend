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
    //[GET] /api/Account/:id
    async getOne(request,response){
        try {
            const findOwner = await OwnerModel.findById(request.params.id).populate('idNumber');
            if(findOwner)
            {
                return response.json({
                    success:true,
                    user:{
                        city: findOwner.city,
                        cmnd: findOwner.cmnd,
                        dateOfBirth:new Date(findOwner.dateOfBirth).toISOString().split('T')[0],
                        district: findOwner.district,
                        firstName: findOwner.firstName,
                        gender: findOwner.gender,
                        phoneNumber: findOwner.idNumber.phoneNumber,
                        image: process.env.API_URL+ findOwner.image,
                        lastName: findOwner.lastName,
                        street: findOwner.street,
                        ward:findOwner.ward,
                        role:'USER',
                        _id:findOwner._id
                    }
                })
            }
            else{
                const findAccount = await doctorModel.findById(request.params.id);
                if(findAccount)
                    return response.json({
                        success:true,
                        user:{
                            city: findAccount.city,
                            cmnd: findAccount.cmnd,
                            dateOfBirth:new Date(findAccount.dateOfBirth).toISOString().split('T')[0],
                            district: findAccount.district,
                            firstName: findAccount.firstName,
                            gender: findAccount.gender,
                            phoneNumber: findAccount.phoneNumber,
                            image: process.env.API_URL+ findAccount.image,
                            lastName: findAccount.lastName,
                            street: findAccount.street,
                            ward:findAccount.ward,
                            role:findAccount.role,
                            _id:findAccount._id
                        }
                    })
                else
                    return response.json({
                        success:false,
                        messages:'Thông tin không tồn tại'
                    })
            }
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
        }
    }

    //[POST] /api/Account/registerByAccount
    async registerByAccount(request,response){
        try {
            const {
                username,
                password,
                role,
                idClinic,
            }=request.body;
            console.log(username)
            if(!username)
                return response.json({
                    success:false,
                    messages:'Tài khoản không được để trống'
                })
            else if(!password)
                return response.json({
                    success:false,
                    messages:'Mật khẩu không được để trống'
                })
            else if(!role)
                return response.json({
                    success:false,
                    messages:'Vai trò không được để trống'
                })
            else{
                const findAccount = await accountModel.findOne({username});
                if(findAccount)
                    return response.json({
                        success:false,
                        messages:'Tài khoản đã tồn tại'
                    })
                else{
                    const hashPassword= await argon2.hash(password)
                    const account = new accountModel({
                        username,
                        password:hashPassword,
                        role,
                        idClinic,
                    })
                    const newAccount = await account.save();
                    return response.json({
                        success:true,
                        messages:'Tạo tài khoản thành công',
                        newAccount
                    })
                }
            }
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
        }
    }

    //[POST] /api/Account/information
    async createInformation(request,response){
        try {
            const {
                lastName,
                firstName,
                dateOfBirth,
                phoneNumber,
                gender,
                street,
                cmnd,
                city,
                district,
                ward,
                // zipCode,
                account
            }=request.body;
            if(!lastName || !firstName)
                return response.json({
                    success:false,
                    messages:'Họ và tên không được để trống'
                })
            else if(!dateOfBirth)
                return response.json({
                    success:false,
                    messages:'Ngày sinh không được để trống'
                })
            else if(!phoneNumber)
                return response.json({
                    success:false,
                    messages:'Số điện thoại không được để trống'
                })
            else if(!gender)
                return response.json({
                    success:false,
                    messages:'Giới tính không được để trống'
                })
            else if(!street)
                return response.json({
                    success:false,
                    messages:'Địa chỉ không được để trống'
                })
            else if(!cmnd)
                return response.json({
                    success:false,
                    messages:'Chứng minh nhân dân không được để trống'
                })
            else if(!city)
                return response.json({
                    success:false,
                    messages:'Thành phố không được để trống'
                })
            else if(!district)
                return response.json({
                    success:false,
                    messages:'Quận/Huyện không được để trống'
                })
            else if(!ward)
                return response.json({
                    success:false,
                    messages:'Xã/Phường không được để trống'
                })
            // else if(!zipCode)
            //     return response.json({
            //         success:false,
            //         messages:'zipcode không được để trống'
            //     })
            else if(!request.file)
                return response.json({
                    success:false,
                    messages:'Ảnh không được để trống'
                })
            else{
                const doctor = new doctorModel({
                    lastName,
                    firstName,
                    dateOfBirth,
                    phoneNumber,
                    gender,
                    street,
                    cmnd,
                    city,
                    district,
                    ward,
                    // zipCode,
                    image: `/images/doctor/${request.file.filename}`,
                    account
                })
                const newDoctor = await doctor.save();
                return response.json({
                    success:true,
                    messages:'Tạo tài khoản thành công',
                    doctor:newDoctor
                })
            }
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
        }
    }
}

module.exports = new AccountController