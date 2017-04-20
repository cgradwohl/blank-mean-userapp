const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    path = require('path'),
    passport = require('passport');



// ENVIRONMENT CONFIG
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envConfig = require('./config/env')[env];



// CONNECT TO DB
mongoose.Promise = global.Promise;
mongoose.connect(envConfig.db);



// EXPRESS CONFIG
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride());
/*app.use(express.static(path.join(__dirname, 'dist')));*/



// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);



// ROUTES
// sets server to serve static folder, which automatically looks for an index.html
app.use(express.static(path.join(__dirname, 'public')));



// SET USERS PATH
const users = require('./api/users');
app.use('/users', users);



// START SERVER
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});
