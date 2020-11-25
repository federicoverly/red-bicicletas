var mongoose = require("mongoose");
var Schema = mongoose.Schema;



var BicicletaSchema = new Schema({
    code:Number,
    color:String,
    modelo:String,
    ubicacion:{
        type:[Number],index:{type:'2dsphere',sparse:true}
    }
});

BicicletaSchema.methods.toString= function(){
    return "code:"+ this.code+ "|color: "+this.color;

}

BicicletaSchema.statics.createInstance = function(code,color,modelo,ubicacion){
    return new this({
        code:code,
        color:color,
        modelo:modelo,
        ubicacion:ubicacion
    });
}



BicicletaSchema.statics.allBicis=function(cb){
    return this.find({},cb);
}

BicicletaSchema.statics.add=function(bici,cb){
    this.create(bici,cb);
}

BicicletaSchema.statics.findByCode = function (code, cb){
    return this.findOne({code:code},cb);
}

BicicletaSchema.statics.removeByCode = function (code, cb){
    return this.deleteOne({code:code},cb);
}


module.exports=mongoose.model("Bicicleta",BicicletaSchema);

