
class IllnessController{
    showAll(rquest,response){
        response.send('Illness Controller');
    }
}

module.exports= new IllnessController;