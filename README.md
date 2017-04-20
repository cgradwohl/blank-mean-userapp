# Tutorial: How to build a backend with node and mongodb.

In this tutorial we will build a server, design an api. connect to a mongodb, create users and authenticate users, all
in the NODE environment. Finally we will deploy to Heroku. There are a ton of great tutorials about this topic and I hope that this tutorial will be added to that
list!

*** DISCLAIMER: You must have node.js, npm, and mongodb installed and you should be familiar with these technologies
before proceeding. You should also signup for a free Heroku account and navigate to your heroku dashboard. Finally make sure you
have HerokuCLI installed***

To start off we want to create a functional directory structure that will allow us to separate concerns as the app
grows in the future. There are several ways this can be done, and I am still learning new and better ways to structure
a backend application. However, for learning purposes the following structure proves to be a valuable scaffold for a
simple user based application.

```
--config
----env.js
----passport.js
----express.js
--models
----user.js
--api
----index.js
----users.js
--public
----index.html
app.js
package.json
```
Open up a terminal, `cd` to someplace nice,  create a new folder, and name that folder something radical like `blank-mean-userapp`.

Run `$ npm init` to create and initialize the `package.json` file. During the initialize process make sure to set the entry
point to `app.js`.

Next, create the above directory structure in your project folder.

Now is a good time to add git to our project. Run `git init && git add . && git commit -m "first commit"`. Now would also be a
good time to add this project to your github account.

AWESOME! Next, we will add some dependances and a `.gitignore` file.

#### package.json

```
{
  "name": "blank-mean-userapp",
  "version": "1.0.0",
  "description": "build server, design api, connect to mongodb, add and authenticate users FROM SCRATCH",
  "main": "app.js",
  "scripts": {
    "test":"echo \"Error: no test specified\" && exit 1",
    "start":"nodemon app"
  },
  "dependencies": {
    "bcryptjs": "*",
    "body-parser": "*",
    "cors": "*",
    "express": "*",
    "jsonwebtoken": "*",
    "method-override": "*",
    "mongoose": "*",
    "nodemon": "*",
    "passport": "*",
    "passport-jwt": "*"
  },
  "author": "Christopher S. Gradwohl",
  "license": "ISC"
}
```

#### .gitignore
```
node_modules/
```

Now install these dependancies: `$ npm install`

Finally we can write some code! Lets start building the express server file `app.js`
#### app.js
```
const express = require('express'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    path = require('path');


const app = express();

// ENVIRONMENT CONFIG
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./config/env')[env];


// CONNECT TO DB
mongoose.connect(envConfig.db);


// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(methodOverride());
/*app.use(express.static(path.join(__dirname, 'dist')));*/

// ROUTES
// set server to serve static folder, which automatically looks for an index.html
app.use(express.static(path.join(__dirname, 'public')));

// set the api users path
/*const users = require('./api/users');
app.use('/users', users);*/

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});

```

This is the main file that will run when a client makes a request to our express server. First we will configure
our express environment which is being called from `app.js` here:

```
// ENVIRONMENT CONFIG
const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./config/environment')[env];
```

Navigate to `./config/env.js`

#### env.js
```
const path = require('path'),
	rootPath = path.normalize(__dirname + '/../../');

module.exports = {
    development: {
        rootPath: rootPath,
        db: 'mongodb://localhost:27017/testDB',
        secret: 'abc123',
        port: process.env.PORT || 3000
    },
    production: {
        rootPath: rootPath,
        db: 'mongodb://admin:abc123@ds111851.mlab.com:11851/heroku_0f5rg3zd',
        secret: 'abc123',
        port: process.env.PORT || 80
    }
}
```
NOTE that you will have a different db URI for your production environment.
Since this app will be deployed to Heroku, we can use a free and easy mongodb deployment service called mLab. Navigate
to your Heroku dashboard and in the right hand corner select New-->Create new app. Name you app the same thing
you named your project folder then click Create App. Follow the instructions to add heroku to your project folder,
I like to use the terminal and the HerokuCLI. Once Heroku is added you should check to make sure there is a remote
heroku git url.

Run `$ git remote -v show`

You should see the heroku path URL AND your github path URL. Yours may look something like this.
```
heroku  https://git.heroku.com/blank-mean-userapp.git (fetch)
heroku  https://git.heroku.com/blank-mean-userapp.git (push)
origin  https://github.com/cgradwohl/blank-mean-userapp.git (fetch)
origin  https://github.com/cgradwohl/blank-mean-userapp.git (push)
```


Now, select your app from your Personal Apps list on your heroku dashboard and then
click the Resources tab in the toolbar. Navigate to the Add-ons search bar and type in: 'mLab'. Add a free mLab
sandbox instance to your project.

Finally follow the instructions on the mLab website to create a user and user password for your production
mongodb instance. Copy and paste you instance URI with your username and user password like I did above.
In my example above my db username is: 'admin' and my db username password is: 'abc123'.

Ok! The environment config should be done for now! Lets create an `index.html` file for our express server to serve!

Go to `./public/index.html`

#### index.html
```
HELLO WORLD!
```

Now let's test out our new sever. Make sure that the following is commented out, since we have not created the users routes yet.
```
// set the api users path
/*const users = require('./api/users');
app.use('/users', users);*/
```

Start the mongodb local instance: `$ mongod`

Run: `$ npm install`
Run: `$ npm start`

Navigate to `http://localhost:3000/` in your browser. You should see 'HELLO WORLD!'' on the the page.

Now lets add our changes to git, push them to github and then deploy to Heroku:
`$ git add . && git commit -m "server now serves public index.html" `
`$ git push`
`$ git push heroku master`

Navigate to your heroku apps url.

WOOHOO! If you see HELLO WORLD! on the localhost and on the heroku app url then you have successfully deployed an express application
to the internet! Congrats!

Now we will complete the backend app by creating api routes for our users, writing server methods to add users to our database and
to login. We will also create a mongodb schema for the User object.

It is nice to visualize the database schema, before connecting routes to it. Go to `./models/user.js` to create a User schema
with mongoose.

#### user.js
```
const mongoose = require('mongoose'),
    bcrypt = require( 'bcryptjs'),
    config = require('../config/env');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    passwords: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

```

We will need to write some routes from the server to the database for our application. These routes should be carefully designed as paths can get long and messy quickly.
Since, our goal is to add and authenticate users we will need server methods that do the following:

1. register new users to the data base
2. login and authenticate existing users from the data base
3. retrieve user profile data from the database

There will be more methods required for more advanced application features, but for now we will start with these three. Go to
`./api/users.js` and add the following:

#### users.js
```
const express = require('express'),
    router = express.Router(),
    User = require('../models/user');


// ROUTES -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

// register new users to the data base
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'Successfully registered user'});
        }
    });
});


// login and authenticate existing users from the data base
router.post('/auth', (req, res, next) => {
    res.send('AUTHENTICATE AND LOGIN PAGE');

    // ADD MAGIC HERE

});


// retrieve user profile data from the database
router.get('/profile', (req, res, next) => {
    res.send('PROFILE PAGE');

    // ADD MAGIC HERE

});


module.exports = router;
```

Here we have partially defined the three methods mentioned above. Notice that in the `/register` route we first
instantiate an new user object and then we call the `User.addUser()` method to add it to the database. Lets
now implment this method using the encryption package `bcrypt`. Go back to `./models/user.js` and add the following:

#### user.js
```
const mongoose = require('mongoose'),
    bcrypt = require( 'bcryptjs'),
    config = require('../config/env');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    passwords: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

// .addUser() method
// adds user to the db
module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        })
    })
}
```

GREAT! Lets finish implementing the remaining routes and DB methods.

#### users.js
```
const express = require('express'),
    router = express.Router(),
    User = require('../models/user'),
    passport = require('passport'),
    jwt = require('jsonwebtoken'),
    config = require('../config/env');


// ROUTES -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -

// register new users to the data base
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if(err){
            res.json({success: false, msg:'Failed to register user'});
        } else {
            res.json({success: true, msg:'Successfully registered user'});
        }
    });
});


// login and authenticate existing users from the data base
router.post('/auth', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user){
            return res.json({success: false, msg: 'User not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if( err ) throw err;
            if( isMatch ){
                const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                });

                res.json({
                    success: true,
                    token: 'JWT '+token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success: false, msg: 'Wrong Password'});
            }
        })
    })
});


// retrieve user profile data from the database
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});


module.exports = router;

```

#### user.js
```
const mongoose = require('mongoose');
const bcrypt = require( 'bcryptjs');
const config = require('../config/env');

const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
}

module.exports.getUserByUsername = (username, callback) => {
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = (newUser, callback) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if( err ) throw err;
        callback(null, isMatch);
    });
}

```




















## Resources

https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
