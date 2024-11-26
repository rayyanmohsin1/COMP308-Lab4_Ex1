// config/config.js

// Load the correct configuration file according to the environment
module.exports = require('./env/' + process.env.NODE_ENV + '.js');
