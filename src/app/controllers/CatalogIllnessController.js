
class CatalogIllnessController{
    showAll(request,response){
        response.send('CatalogIness Controller');
    }
}


module.exports= new CatalogIllnessController;