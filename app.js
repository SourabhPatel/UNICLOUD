const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
var multer = require('multer');
// for DB connection using our DB connection  config file
const config = require('./config/database');
mongoose.connect(config.database);
mongoose.connection.on('connected',() => {
    console.log('Connected to database name is '+config.database);
});
// on DB connection error
mongoose.connection.on('error', (err) => {
 console.log('Databse connection error '+ err);
});

const app =express();
const app1 =express.Router();

const routes = require('./routes/unicloud');
// const users =require('./routes/users');
// const dropbox =require('./routes/dropbox');
// port number
const port = 8080;

//cors middleware
app.use(cors()); // used for cross domain request

//set static public folder for cient side angular app
app.use(express.static(path.join(__dirname,'public')));
app.use(function(req, res, next) { //allow cross origin requests
    
            res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    
            res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    
            res.header("Access-Control-Allow-Credentials", true);
    
            next();
    
        });


// body parser middleware
app.use(bodyParser.json());

//passport middleware for authentication
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);
app.use('/',routes.router);

// index route
// app.get('/',(req,res) => {
//     res.send('Invalid endpoint');
// });

// started server
app.listen(port, () => {
 console.log('Server started at port '+port);
})