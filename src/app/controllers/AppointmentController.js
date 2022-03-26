const { findById } = require('../models/AppointmentModel');
const appointmentModal = require('../models/AppointmentModel');
const account = require('../models/DoctorModel');

class AppointmentController{

    //[POST] api/Appointment/request
    async requestOne(request,response){
        const {
            idDoctor,
            idPet,  
            content,
            startDate
        }=request.body;
        console.log(request.body)
        if(!idPet)
            return response.json({
                success:false,
                messages:'Chọn 1 thú cưng'
            })
        else if(!startDate.split(' ')[0]|| !startDate.split(' ')[1])
            return response.json({
                success:false,
                messages:'Chọn ngày và giờ'
            })
        else if(new Date(startDate)< new Date())
            return response.json({
                success:false,
                messages:`Bây giờ là: ${new Date().toLocaleDateString()+" "+ new Date().toLocaleTimeString()}`
            })
        else
            try {
                const findAppointment = await appointmentModal.findOne({startDate,idOwner:request.userId});
                if(findAppointment){
                    return response.json({
                        success:false,
                        messages:`Bạn đã có lịch tại ${startDate}`
                    })
                }
                var date= startDate.split(' ')
                var dateString='';
                if(Number(date[1].split(':')[0])+1>=12)
                    dateString=date[0]+" "+(Number(date[1].split(':')[0])+1-12)+":"+date[1].split(':')[1]+" PM";
                else
                    dateString=date[0]+" "+(Number(date[1].split(':')[0])+1)+":"+date[1].split(':')[1]+" "+date[2];

                
                const appointment = new appointmentModal({
                    idOwner:request.userId,
                    idDoctor,
                    idPet,
                    content,
                    startDate,
                    endDate:dateString
                })

                const newAppointment = await appointment.save();
                if(newAppointment)
                    return response.json({
                        success:true,
                        appointment:newAppointment
                    })
                else
                    return response.json({
                        success:false,
                        messages:'yêu cầu không thành công'
                    })
            } catch (error) {
                return response.json({
                    success:false,
                    messages:'yêu cầu không thành công'
                })
                
            }
    }
    
    //[GET] api/Appointment
    async showAll(request,response){
        try {
            const admin= await account.findById(request.userId).populate({path:'account',select: 'role',match:{role:'ADMIN'}});
            if(admin?.account)
            {
                const appointments = await appointmentModal.find({}).populate('idOwner').populate('idPet').populate('idDoctor');
                return response.json({
                    success:true,
                    appointments
                })
            }else
            {
                const appointments = await appointmentModal.find({idOwner:request.userId.toString()}).populate('idOwner').populate('idPet').populate('idDoctor');
                return response.json({
                    success:true,
                    appointments
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

    //[DELETE] api/Appointment/:id
    async deleteOne(request,response){
        try {
            const appointment = await appointmentModal.
                findOneAndUpdate({idOwner:request.userId,_id:request.params.id},
                {status:'CANCELED'},
                {new:true}).populate('idOwner').populate('idPet').populate('idDoctor')
            if(appointment)
                return response.json({
                    success:true,
                    appointment
                })
            else
                return response.json({
                    success:false,
                    messages:'Cuộc hẹn không tồn tại'
                })
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
        }
    }
    //[PATCH] api/Appointment/:id
    async acceptOne(request,response){
        try {
            const {
                startDate,
                endDate,
                Location,
                idDoctor
            }=request.body
            if(new Date(startDate)< new Date())
                return response.json({
                    success:false,
                    messages:`Bây giờ là: ${new Date().toLocaleDateString()+" "+ new Date().toLocaleTimeString()}`
                })
            else if(!startDate.split(' ')[0] ||! startDate.split(' ')[1])
                return response.json({
                    success:false,
                    messages:'Chọn ngày giờ bắt đầu'
                })
            else if(!endDate.split(' ')[0] ||! endDate.split(' ')[1])
                return response.json({
                    success:false,
                    messages:'Chọn ngày giờ kết thúc'
                })
            else if(!idDoctor)
                return response.json({
                    success:false,
                    messages:'Chọn bác sĩ',
                })
            else if( new Date(endDate)<= new Date(startDate))
                return response.json({
                    success:false,
                    messages:'Thời gian kết thúc không thể nhỏ hơn hoặc bằng thời gian bắt đầu',
                })
            else {
                const appointment = await appointmentModal.findByIdAndUpdate(request.params.id,{
                    startDate,
                    endDate,
                    Location:null,
                    idDoctor,
                    status:'WAITING'
                },{new:true});

                return response.json({
                    success:true,
                    appointment, 
                })
            }
            
        } catch (error) {
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
        }
    }
}

module.exports = new AppointmentController;