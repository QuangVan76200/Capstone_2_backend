
class ClinicController{
    showAll(request,response){
        response.send('Clinic Controller');
    }
}

module.exports= new ClinicController;