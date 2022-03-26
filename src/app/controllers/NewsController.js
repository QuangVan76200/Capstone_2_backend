const vetDoctor= require('../models/DoctorModel');
const {multipleMongoose}=require('../../util/mongoose');
class NewsController {

    //[Get]/news
    index(request, response) {
        vetDoctor.find({}).then(vetDoctor=>{
            vetDoctor:multipleMongoose(vetDoctor);
            
        })
        
        // response.render('News');

        response.json({success:'thanhcong'})
    }
    show(request, response) {
        response.json({success:'that bai'});
    }
}

module.exports = new NewsController;