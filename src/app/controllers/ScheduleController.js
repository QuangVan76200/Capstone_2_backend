const ScheduleModel = require('../models/ScheduleModel');
const accountModel = require('../models/DoctorModel');
const DoctorModel = require('../models/DoctorModel');
class ScheduleController{
    //[POST] api/Schedule
    async updateOne(request,response){
        try {
            const {newDataSource}=request.body;
            console.log(newDataSource)
            for(var data of newDataSource){
                if(data._id)
                {
                    const  updatedSchedule =await ScheduleModel.findByIdAndUpdate(data._id,{
                        startDate:data.startDate,
                        endDate:data.endDate
                    })
                }
                else
                {
                    const newSchedule= new ScheduleModel({
                        idDoctor:data.idDoctor,
                        startDate:data.startDate,
                        endDate:data.endDate
                    })
                    await newSchedule.save();
                }
            }
            return response.json({
                success:true,
                messages:'Cập nhập thành công'
            })
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
        }
    }

    // [GET] api/Schedule
    async showAll(request,response){
        try {
            const findAccount = await DoctorModel
            .findById(request.userId)
            .populate({path:'account'})
            if(findAccount.account.role==='ADMIN'){
                const schedules =await  ScheduleModel.find({}).populate({path:'idDoctor',select:['firstName','lastName']});
                return response.json({
                    success:true,
                    schedules
                })
            }else{
                const schedules =await  ScheduleModel.find({idDoctor:request.userId}).populate({path:'idDoctor',select:['firstName','lastName']});
                console.log(schedules)
                return response.json({
                    success:true,
                    schedules
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

module.exports = new ScheduleController;