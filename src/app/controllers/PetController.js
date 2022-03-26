const fs =require('fs');
const path = require('path');
const petModel = require('../models/PetModel');
const appointmentModel = require('../models/AppointmentModel')
class PetController {
    //[POST] /api/Pet
    async addPet (request,response){
        const {
            breed,
            species,
            namePet,
            gender,
            age,
            weight,
            avatar,
        }=request.body
        if(!breed)
            return response.json({
                success:false,
                messages:'Loại vật nuôi không để trống'
            })
        else if (!species)
            return response.json({
                success:false,
                messages:'Giống vật nuôi không để trống'
            })
        else if(!namePet)
            return response.json({
                success:false,
                messages:'Không để trống tên thú cưng'
            })
        // else if(!age&& age!==0)
        //     return response.json({
        //         success:false,
        //         messages:'không để trống tuổi'
        //     })
        // else if (!weight && weight !== 0)
        //     return response.json({
        //         success:false,
        //         messages:'không để trống cân nặng'
        //     })
        else if (!gender)
            return response.json({
                success:false,
                messages:'không để trống giống'
            })
        else{
            try {
                const imagePet = request.files.map(value=>{
                    return {image:`/images/pet/${value.filename}`}
                })
                var newPet = new petModel({
                    breed,
                    species,
                    namePet,
                    gender,
                    age,
                    weight,
                    avatar,
                    idOwner:request.userId,
                    imagePet
                })
                newPet = await newPet.save();
                console.log(newPet)
                for(var image of newPet.imagePet){
                    image.image=process.env.API_URL+image.image
                }
                console.log(newPet)
                return response.json({
                    success:true,
                    pet:newPet,
                    messages:'Thêm thú cưng thành công'
                })
            } catch (error) {
                return response.json({
                    success:false,
                    messages:'Lỗi server'
                })
            }
        }
        
    }

    //[GET] /api/Pet/list-pet
    async showByOwnerId(request,response){
        try {
            const reponse = await petModel.find({idOwner:request.userId});
            
            const pets = reponse.map(pet=>{
                return{
                    _id:pet._id,
                    breed:pet.breed,
                    species:pet.species ,
                    namePet:pet.namePet,
                    gender: pet.gender,
                    age:pet.age,
                    weight:pet.weight,
                    statusPet:pet.statusPet,
                    statusRecord:pet.statusRecord,
                    avatar:pet.avatar ,
                    createdAt:pet.createdAt,
                    imagePet:pet.imagePet.map(image=>{
                        return{
                            _id:image._id,
                            image:process.env.API_URL+image.image
                        }
                    })
                }
            })
            response.json({
                success:true,
                pets
            })
        } catch (error) {
            response.json({
                success:false,
                messages:'Lỗi server'
            })
        }

    }
    // [GET] /api/Pet/list-pet/:id
    async showByPetId(request,response){
        try {
            const pet = await petModel.findOne({idOwner:request.userId,_id:request.params.id});

            response.json({
                success:true,
                pet:{
                    _id:pet._id,
                    breed:pet.breed,
                    species:pet.species ,
                    namePet:pet.namePet,
                    gender: pet.gender,
                    age:pet.age,
                    weight:pet.weight,
                    statusPet:pet.statusPet,
                    statusRecord:pet.statusRecord,
                    avatar:pet.avatar ,
                    createdAt:pet.createdAt,
                    imagePet:pet.imagePet.map(image=>{
                        return{
                            _id:image._id,
                            image:process.env.API_URL+image.image
                        }
                    })
                }
            })
        } catch (error) {
            console.log(error)
            response.json({
                success:false,
                messages:'Lỗi server'
            })
        }

    }
    //[DELETE] /api/Pet/id
    async deletePet(request,response){
        try {
            const findPet = await appointmentModel.find({idPet:request.params.id,status:['REQUESTING','WAITING']});
            if(findPet.length>0){
                return response.json({
                    success:false,
                    messages:'Thú cưng đang trong cuộc hẹn'
                })
            }
            else{
                const deletedPet = await petModel.findByIdAndDelete(request.params.id);
                if(deletedPet)
                {
                    for(const image of deletedPet.imagePet){
                        if(fs.existsSync(path.join(__dirname,`../../public/img/pet/${image.image.split('/')[3]}`)))
                        {
                            fs.rmSync(path.join(__dirname,`../../public/img/pet/${image.image.split('/')[3]}`));
                        }
                    }
                    return response.json({
                        success:true,
                        messages:'Xóa thú cưng thành công',
                        deletedPet
                    })
                }
                else
                    return response.json({
                        success:false,
                        messages:'Thú cưng không tồn tại'
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

module.exports =new PetController