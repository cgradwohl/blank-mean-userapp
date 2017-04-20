const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    path = require('path');


const app = express();

// ENVIRONMENT CONFIG
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./config/environment')[env];


// CONNECT TO DB
mongoose.connect(envConfig.db);


// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));

// ROUTES
// set server to serve static folder, which automatically looks for an index.html
app.use(express.static(path.join(__dirname, 'public')));

// set the api users path 
const users = require('./api/users');
app.use('/users', users);

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});
