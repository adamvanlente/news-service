var mongoose = require('mongoose');
var NewsItem = require('../app/models/news_item');
var config   = require('../config/database.js');

// Connecting to a local test database or creating it on the fly
mongoose.connect(config.connect_url);

// Mocha test for a feed item.
describe('NewsItem', function(){

    // Delete feed item model after each test run.
    afterEach(function(done){
        NewsItem.model.remove({}, function() {
            done();
        });
    });

    // =====================
    // TEST creating a feed item.
    // _____________________
    it('creates a new feed item.', function(done) {

        var NewsItemObject     = {};

        NewsItemObject.author  = 'Elmore Leonard';
        NewsItemObject.title   = 'Freaky Deaky';

        NewsItem.createNew(NewsItemObject, function(doc) {
            doc.author.should.eql('Elmore Leonard');
            doc.title.should.eql('Freaky Deaky');
            done();
        });
    });

    // =====================
    // TEST finding a feed item by title.
    // _____________________
    it('find a feed item by title.', function(done) {

        var NewsItemObject     = {};

        NewsItemObject.author  = 'Elmore Leonard';
        NewsItemObject.title   = 'Freaky Deaky';

        NewsItem.createNew(NewsItemObject, function(doc) {});

        NewsItem.findByTitle('Freaky Deaky', function(item) {
            item.title.should.eql('Freaky Deaky');
            done();
        })

    });

});
