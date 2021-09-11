const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true,
        dropDups:true,
    },
    phone:{
        type:Number
    },
    registered:{
        type:Boolean,
        default:false
    }
})

const userModel = mongoose.model('Users',userSchema)

module.exports = userModel