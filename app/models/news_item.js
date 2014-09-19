// ******************************************
// Schema for News Item.
// __________________________________________

var mongoose = require('mongoose');

// Create the model for news items and expose it to our app
var NewsItem = function() {

    var _schemaModel = mongoose.Schema({

        itemId      : String,
        date        : Date,
        author      : String,
        content     : String,
        source      : String,
        source_url  : String,
        title       : String,
        type        : String,
        votes       : {
            type : String,
            default: '0'
        }
    });

    // Define the Model.
    var _model = mongoose.model('NewsItem', _schemaModel);

    // Function for creating new item.
    var _createNew = function(NewsItemObject, callback) {
        _model.create(NewsItemObject, function(err, doc) {

            if(err) {
                console.log(err);
            } else {
                callback(doc);
            }
        });
    };

    // Find all items.  Accept start param for pagination.
    var _findAll = function(start, callback, limit) {
        limit = limit || 20
        _model.find({}, {__v: 0}, {sort: {date: -1}, skip: start, limit: limit},
            function(err, doc) {

            if(err) {
                console.log(err);
            } else {
                doc.start = start;
                callback(doc);
            }
        });
    };

    // Basic find - accepts all the params as arguments for greater customization.
    var _simpleFind = function(searchObj, exclude, filters, callback, fail) {

        _model.find(searchObj, exclude, filters, function(err, doc) {

            if(err) {
                fail(err);
            } else {
                callback(doc);
            }
        });
    };

    // Find an item by its title.
    var _findByTitle = function(title, callback) {
        _model.findOne({ title: title }, function(err, doc) {

            if(err) {
                console.log(err);
            } else {
                callback(doc);
            }
        });
    };

    // Search for articles with argument "string" in the title.
    var _searchTitleForString = function(term, start, callback) {
        _model.find({ title: new RegExp(term, "i")}, {__v: 0},
            {sort: {date: -1}, skip: start}, function(err, doc) {

            if (err) {
                console.log(err);
            } else {
                callback(doc);
            }

        });
    };

    // Return public functions.
    return {
        createNew: _createNew,
        findAll: _findAll,
        findByTitle: _findByTitle,
        simpleFind: _simpleFind,
        schema: _schemaModel,
        searchTitleForString: _searchTitleForString,
        model: _model
    }
}();

// Export News Item.
module.exports = NewsItem;
