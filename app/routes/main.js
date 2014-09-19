// ******************************************
// Route specifically for the auto-adding
// of tweets and blog posts.
// __________________________________________

module.exports = function(app) {

    // Import twitter and blog cron job helpers.
    var news      = require('../cron/news');

    // Import NewsItem model.
    var NewsItem  = require('../models/news_item');

    // Utilities
    var newsUtils = require('./news-utils.js');

    // Set up a route for our cron job; it will run with a curl command.
    app.get('/cron', function(req, res) {

        // Load new stories to the database.
        news.loadLatestNewsStories();

        // Render a message.
        var responseObject      = {};
        responseObject.success  = true;
        responseObject.message  = 'Added news stories.';

        res.json(responseObject);
    });

    // Show the newest news stories.
    app.get('/api/v1/news/:start', function(req, res) {

        var start = req.params.start;
        NewsItem.findAll(start, function(doc) {

            var responseObject = {};
            responseObject["count"] = doc.length;
            responseObject["results"] = doc;

            if (doc.length >= 20) {
                var nextStart = parseInt(doc.start) + 20;
                responseObject["next_page"] = '/api/v1/news/' + nextStart;
            }

            res.json(responseObject);
        })
    });

    // Show the newest news stories.
    app.get('/api/v1/topnews', function(req, res) {

        // Send response object to utility to delegate it for handling response.
        var top = newsUtils.getTopStories(res);
    });

    app.get('/api/v1/news/search/:search', function(req, res) {

        var start   = req.params.start;
        var search  = req.params.search;

        NewsItem.searchTitleForString(search, start, function(doc) {

          var responseObject = {};
          responseObject["count"] = doc.length;
          responseObject["results"] = doc;

          res.json(responseObject);
        })
    });

};
