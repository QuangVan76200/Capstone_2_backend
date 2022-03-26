module.exports={
    multipleMongoose: function (mongooses){
        mongooses.map(mongoose => mongoose.toObject());
    },
    MongooseToObject: function(mongoose){
        return mongoose? mongoose.toObject:mongoose;
    }
};