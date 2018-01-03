const mongoose = require ('mongoose');
const config = require('../config/database');
var file = {
	id : String,
	name : String,
	path : String,
	cloud: String,
	
}
const Share_FileSchema = mongoose.Schema({
    
    file : {
		type : file,
		required : true
	},
    sharedBy : {
		type : String,
		required : true
	},
    sharedTo : {
		type : String,
		required : true
	}
});


const Share_File = module.exports = mongoose.model('Share_File',Share_FileSchema);
module.exports.addTouple = function(touple,callback){
	touple.save(callback);
}