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
