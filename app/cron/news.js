// ******************************************
// Pass over RSS feeds and store posts in the DB.
// __________________________________________

// Import Feed Reader, NewsItem schema and list of feeds.
var feedRead   = require('feed-read');
var NewsItem   = require('../models/news_item');
var config     = require('../../config/feed-lists');


// ******************************************
// Function to export
// __________________________________________

module.exports = {

  loadLatestNewsStories: function() {

        // List if RSS feeds to check.
        var feedList = config.feedList;

        // Pass over the list of feeds.
        for (var i = 0; i < feedList.length; i++) {

            var NewsItem = feedList[i];

            // Read an RSS feed, and store each article.
            feedRead(NewsItem, function(err, articles) {
                if (err) {
                    console.log('feedReader failed on an item: ', NewsItem);
                } else {
                    for (var j = 0; j < articles.length; j++) {
                        storeArticleContent(articles[j]);
                    }
                }

            });
        }
    },
};

// ******************************************
// Helper functions for storing newest posts.
// __________________________________________

// Store an article in the DB.
function storeArticleContent(article) {

    // Ignore articles without content.
    if (article && !article.content || article.content == '') {
        console.log('This article has no content or does not exist.');
    } else {

        // Confirm this item does not exist.
        NewsItem.findByTitle(article.title, function(item) {

            if (item) {
                console.log('This (blog) item already exists.')
            } else {

                // Create a new feed item for the database.
                var newNewsItem         = {};

                newNewsItem.itemId      = article.title;
                newNewsItem.title       = article.title;
                newNewsItem.content     = article.content;
                newNewsItem.date        = article.published;
                newNewsItem.source      = article.feed.name;
                newNewsItem.author      = article.author;
                newNewsItem.source_url  = article.link;
                newNewsItem.type        = 'news';


                NewsItem.createNew(newNewsItem, function(doc) {
                    console.log('added item');
                });

            }
        });
    }
}
