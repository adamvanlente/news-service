// ******************************************
// News Service app
//
// Dumps news articles into a db for easy
// recall / searching.
// __________________________________________

// Add neccessary modules.
var port         = 3250;
var express      = require('express');
var mongoose     = require('mongoose');

var configDB     = require('./config/database.js');

// Connect to database.
mongoose.connect(configDB.url);

// Set up the express application.
var app = express();

// Pass app to route.
require('./app/routes/main.js')(app);

// launch ======================================================================
app.listen(port);
console.log('update server running on port', port);
