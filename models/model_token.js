const mongoose = require ('mongoose');
const config = require('../config/database');
const Model_TokenSchema = mongoose.Schema({
	user_id : {
		type : String,
		required : true
	},
	
	cloud_name : {
		type : String,
		required : true
	},
	access_token : {
		type : String,
		required : true
	}
});
const Model_Token = module.exports = mongoose.model('Model_Token',Model_TokenSchema);

module.exports.addToken = function(token,callback){
	token.save(callback);
}
module.exports.getTokenByIdAndCloud =  function(id,cloud){
	var result;
	console.log("id= "+id+" cloud = "+cloud);
	var query = Model_Token.findOne({user_id : id,cloud_name : cloud});
	 query.select('access_token');		
	  query.exec(function(err,res){
		console.log('tok = %s',res);
		result=  res;
		return res;
	});
	console.log("result "+result);

}