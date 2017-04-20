# Tutorial: How to build a backend with node and mongodb.

In this tutorial we will build a server, design an api. connect to a mongodb, create users and authenticate users, all
in the NODE environment. There are a ton of great tutorials about this topic and I hope that this tutorial will be added to that
list!

*** DISCLAIMER: You must have node.js, npm, and mongodb installed and you should be familiar with these technologies
before proceeding***

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
----users.js
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
    "mongoose": "*",
    "nodemon": "*",
    "passport": "*",
    "passport-jwt": "*"
  },
  "author": "Christopher S. Gradwohl",
  "license": "ISC"
}
```

####.gitignore
```
node_modules/
```

Now install these dependancies: `$ npm install`

https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
