const messageModel = require('../models/MessageModel');
const ownerModel = require('../models/OwnerModel');
const doctorModel =require('../models/DoctorModel');
const { findById, findByIdAndUpdate } = require('../models/MessageModel');
class MessengerController{

    // [GET] api/Messenger/list
    async showAll(request,response){
        try {
            const messages =await messageModel.find({}).or([{senderId:request.userId},{recieverId:request.userId}]).select('-updatedAt');
            const filterMessages =[];
            for(const mess of messages){
                if(mess.senderId==request.userId||mess.recieverId==request.userId){
                    if(filterMessages.length>0){
                        var boolean=true;
                        for(var i=0;i<filterMessages.length;i++){
                            if((mess.senderId===filterMessages[i].recieverId&&mess.recieverId===filterMessages[i].senderId)||(mess.recieverId===filterMessages[i].recieverId&&mess.senderId===filterMessages[i].senderId))
                            {
                                filterMessages[i]=mess;
                                boolean=false;
                                break;
                            }
                                
                        }
                        if(boolean)
                            filterMessages.push(mess)
                    }
                    else
                        filterMessages.push(mess)
                }
            }
            for(var i = 0; i<filterMessages.length;i++){
                try {
                    const _id=(filterMessages[i].senderId===request.userId?filterMessages[i].recieverId:filterMessages[i].senderId)
                    const owner=await ownerModel.findById(_id);
                    const doctor=await doctorModel.findById(_id);
                    filterMessages[i]=owner?
                    {
                        firstName:owner?.firstName,
                        image:process.env.API_URL+owner?.image,
                        senderId:filterMessages[i].senderId ,
                        recieverId: filterMessages[i].recieverId,
                        textMessage: filterMessages[i].textMessage,
                        createdAt: filterMessages[i].createdAt,
                        isRead:filterMessages[i].isRead,
                        _id:filterMessages[i]._id
                    }:{
                        firstName:doctor?.firstName,
                        image:process.env.API_URL+ doctor?.image,
                        senderId:filterMessages[i].senderId ,
                        recieverId: filterMessages[i].recieverId,
                        textMessage: filterMessages[i].textMessage,
                        createdAt: filterMessages[i].createdAt,
                        isRead:filterMessages[i].isRead,
                        _id:filterMessages[i]._id
                    }
                } catch (error) {
                    console.log(error.toString())
                }
            }
            
            return response.json({
                success:true,
                messages:filterMessages
            })
        } catch (error) {
            return response.json({
                success:false,
                message:error.toString()
            })
        }
    }
    // [PATCH] api/Messenger/list/:{id}
    async changeRead (request,response){
        try {
            const message =await messageModel.findByIdAndUpdate(request.params.id,{isRead:true});
            if(message)
                return response.json({
                    success:true
                })
        } catch (error) {
            console.log(error.toString())
            return response.json({
                success:false
            })
        }
    }
}

module.exports= new MessengerController;