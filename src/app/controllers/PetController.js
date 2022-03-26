const fs =require('fs');
const path = require('path');
const petModel = require('../models/PetModel');
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
            return response.json({
                success:true,
                pet:newPet
            })
        } catch (error) {
            return response.json({
                success:false,
                messages:'Lỗi server'
            })
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
}

module.exports =new PetController