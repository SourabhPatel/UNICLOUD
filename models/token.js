const mongoose = require('mongoose');

const TokenSchema = mongoose.Schema({
    email:{
        type : String,
        required : true
    },
    accessKey:{
        type : String,
        required: true
    },
    refreshKey:{
        type : String,
        required: true
    }
});
const Token = module.exports = mongoose.model('Token',TokenSchema);