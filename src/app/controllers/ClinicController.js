const clinicModel =require('../models/ClinicModel')

class ClinicController{
    async createOne(request,response){
        const {
            nameClinic,
            landLine,
            street,
            city,
            district,
            province,
            zipCode
        }=request.body
        if(!nameClinic)
            return response.json({
                success:false,
                messages:'Tên cơ sở không để trống'
            })
        else if (!landLine)
            return response.json({
                success:false,
                messages:'Số điện thoại không để trống'
            })
        else if(!street)
            return response.json({
                success:false,
                messages:'Địa chỉ không để trống'
            })
        else if(!city)
            return response.json({
                success:false,
                messages:'Thành phố không để trống'
            })
        else if (!district)
            return response.json({
                success:false,
                messages:'Quận/Huyện không để trống'
            })
        else if (!province)
            return response.json({
                success:false,
                messages:'Xã/Phường không để trống'
            })
        else{
            try {
                const imageClinic = `/images/clinic/${request.file.filename}`
                var newClinic = new clinicModel({
                    nameClinic,
                    landLine,
                    street,
                    city,
                    district,
                    province,
                    avatar:imageClinic
                })
                newClinic = await newClinic.save();
                
                return response.json({
                    success:true,
                    pet:{
                        nameClinic:newClinic.nameClinic,
                        landLine:newClinic.landLine,
                        street:newClinic.street,
                        city:newClinic.city,
                        district:newClinic.district,
                        province:newClinic.province,
                        avatar:process.env.API_URL+newClinic.avatar
                    },
                    messages:'Thêm cơ sở thành công'
                })
            } catch (error) {
                console.log(error.toString())
                return response.json({
                    success:false,
                    messages:'Lỗi server'
                })
            }
        }
    }
    async showAll(request,response){
        try {
            const clinics = await clinicModel.find({});
            const newClinics =clinics.map(value=>{
                return{
                    _id:value._id,
                    nameClinic:value.nameClinic,
                    landLine:value.landLine,
                    street:value.street,
                    city:value.city,
                    district:value.district,
                    province:value.province,
                    zipCode:value.zipCode,
                    avatar:process.env.API_URL+ value.avatar,
                    review:value.review
                }
            })
            return response.json({
                success:true,
                clinics:newClinics
            })
        } catch (error) {
            return response.json({
                success:false,
                messages:'Loi server'
            })
        }
    }
    async findById(request,response){
        try {
            const clinic = await clinicModel.findById(request.params.id).populate('review.idOwner');
            return response.json({
                success:true,
                clinic:{
                    _id:clinic._id,
                    nameClinic:clinic.nameClinic,
                    landLine:clinic.landLine,
                    street:clinic.street,
                    city:clinic.city,
                    district:clinic.district,
                    province:clinic.province,
                    zipCode:clinic.zipCode,
                    avatar:process.env.API_URL+ clinic.avatar,
                    review:clinic.review
                }
            })
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false,
                messages:'Loi Server'
            })
        }
    }
    async reviewClinic (request,response){
        try {
            const {
                idClinic,
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
                const clinic = await clinicModel.findById(idClinic).select('review');
                    if(clinic.review.filter(value=>value.idOwner.toString()===request.userId).length>0)
                        return response.json({
                            success:false,
                            messages:'Bạn đã đánh giá cơ sở này rồi'
                        })
                    else
                    {//
                        clinic.review.push({
                            idOwner:request.userId,
                            rating,
                            comments
                        })
                        const updateClinc= await clinicModel.findByIdAndUpdate(idClinic,{review:clinic.review});
                        return response.json({
                            success:true,
                            messages:'Đánh giá thành công',
                            clinic:updateClinc
                        })
                    }
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

module.exports= new ClinicController;