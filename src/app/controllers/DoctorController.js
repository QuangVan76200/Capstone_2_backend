// const doctorModel = require('../models/DoctorModel');
const appointmentModel = require('../models/AppointmentModel')
const doctorModel = require('../models/DoctorModel');


class DoctorController {
    //[GET] /api/Doctor/:id
    async findOne(request,response){
        try {
            const findDoctor = await doctorModel.findById(request.params.id).populate('review.idOwner');

            if(findDoctor)
                return response.json({
                    success:true,
                    doctor:{
                        firstName:findDoctor.firstName,
                        lastName:findDoctor.lastName,
                        dateOfBirth:findDoctor.dateOfBirth,
                        phoneNumber:findDoctor.phoneNumber,
                        gender:findDoctor.gender,
                        image:process.env.API_URL+ findDoctor.image,
                        street:findDoctor.street,
                        city:findDoctor.city,
                        district:findDoctor.district,
                        ward:findDoctor.ward,
                        zipCode:findDoctor.zipCode,
                        _id:findDoctor._id,
                        review:findDoctor.review
                    }
                })
            else
                return response.json({
                    success:false,
                    message:'Không tồn tại bác sĩ nào'
                })
        } catch (error) {
            return response.json({
                success:false,
                message:'Không tồn tại bác sĩ nào'
            })
        }
    }

    //[GET] /api/Doctor/list-doctor
    async showAll(request, response, next) {
        try {
            const doctors = await doctorModel.find({}).select('-account');
            const newDoctors= doctors.map(doctor=>{
                return{
                    _id:doctor._id,
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
                    review:doctor.review
                }
            })
            return response.json({
                doctors:newDoctors,
                success:true,
            })
        } catch (error) {
            return response.json({
                success:false,
                message:error
            })
        }
    }

    //[GET] api/Doctor/list-doctor/:id
    async showOne(request, response, next) {
        try {
            const doctors = await doctorModel.find({}).populate({path:'account'});
            const newDoctors= doctors
            .filter(doctor=>doctor.account.idClinic==request.params.id?true:false)
            .map(doctor=>{
                return{
                    _id:doctor._id,
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
                    review:doctor.review,
                    account:doctor.account
                }
            })
            return response.json({
                doctors:newDoctors,
                success:true,
            })
        } catch (error) {
            return response.json({
                success:false,
                message:error
            })
        }
    }


    //[POST] /api/Doctor/review
    async reviewDoctor (request,response){
        try {
            const {
                idDoctor,
                rating,
                comments
            }=request.body
            if(rating==0)
                return response.json({
                    success:false,
                    messages:'Đánh giá ít nhất 1 sao'
                })
            else if(!comments)
                return response.json({
                    success:false,
                    messages:'Comment không được để trống'
                })
            else
            {
                
                const appointment = await appointmentModel.findOne({idOwner:request.userId,idDoctor});
                if(appointment){
                    const doctor = await doctorModel.findById(idDoctor,{review:[]}).select('review');
                    if(doctor.review.filter(value=>value.idOwner.toString()===request.userId).length>0)
                        return response.json({
                            success:false,
                            messages:'Bạn đã đánh giá bác sĩ này rồi'
                        })
                    else
                    {
                        doctor.review.push({
                            idOwner:request.userId,
                            rating,
                            comments
                        })
                        const updateDoctor= await doctorModel.findByIdAndUpdate(idDoctor,{review:doctor.review});
                        return response.json({
                            success:true,
                            messages:'Đánh giá thành công',
                            doctor:updateDoctor
                        })
                    }
                }
                else
                    return response.json({
                        success:false,
                        messages:'Bạn đã chưa từng có cuộc hẹn này với bác sĩ'
                    })
            }
        } catch (error) {
            console.log(error)
            return response.json({
                success:false,
                messages:'Lỗi Server'
            })
        }
    }
}
module.exports = new DoctorController;