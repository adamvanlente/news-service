// ******************************************
// News Utility to help determine popular
// content.
// __________________________________________


// Import NewsItem model.
var NewsItem  = require('../models/news_item');

// Some holders and variables to assist in determining
// which feed items are most popular.
var articleHelper = {

    // Count how often words appear in headlines.
    wordCounter                 : {},

    // Sorted holder for counted words in headlines.
    sortedWordCounter           : [],

    // The top words found in all the headlines.
    topWords                    : [],

    // A headlines and the top words found within it.
    headlineAndWordOccurences   : [],

    // How many articles to pull from.
    sampleSet                   : 1000,

    // How many times must a word be found to be considered a top word?
    topWordThreshold            : 15,

    // How many top keywords must occur in an article title to make it relevant?
    // Eg if 3, and [new, album, out] are words, it will bring back all titles
    // with those three words.  If you up it to 4, perhaps it will catch
    // titles with [new, album, out, Lorde], if "Lorde" has occurred often, and
    // ignore titles about new albums from less popular artists.  This is just
    // an example - in truth, tweak this by feel based on sampleSet used.
    wordOccurenceThreshold      : 4,

    // Words that should be ignored if found in headlines.
    crapWords                   : ["to", "the", "of", "a", "I", "for", "as",
                                   "at", "you", "", " ", "on", "in", "The",
                                   "News", "news", "with", "and", "And", "by",
                                   "has", "it", "It", "in", "In", "if", "If",
                                   "...", "is", "Is", "--"]
}

module.exports = {

    // From a list of articles, get the top headlines.  res is passed as
    // an argument so that this doc can handle rendering of response.
    getTopStories: function(res) {

        // Database query parameters.
        var searchFor           = {};
        var exclude             = {__v: 0};
        var filters             =
            {sort: {date: -1}, skip: 0, limit: articleHelper.sampleSet};

        // Look for articles in the DB.
        NewsItem.simpleFind(searchFor, exclude, filters, function(doc) {

            // Reset some Global counters, otherwise Node will hold their state
            // in the app and continue adding to them on each refresh.
            articleHelper.wordCounter                 = {};
            articleHelper.sortedWordCounter           = [];
            articleHelper.topWords                    = [];
            articleHelper.headlineAndWordOccurences   = [];

            // Look for top stories.
            parseHeadlinesForTopStories(doc, res);

        }, function(err) {

            // Render empty response on error.
            var response        = {}
            response.count      = 0;
            response.results    = []
            res.json(response);

        });
    }
};

// Given a list of articles, iterate over all headlines and keep track
// of each word in every headline.
function parseHeadlinesForTopStories(articles, res) {
    for (var i = 0; i < articles.length; i++) {

        var article = articles[i];
        var wordsInArticleTitle = article.title.split(' ');

        for (var j = 0; j < wordsInArticleTitle.length; j++) {
            var word = wordsInArticleTitle[j];
            var validWord = articleHelper.crapWords.indexOf(word) == -1;
            if (validWord) {
                if (articleHelper.wordCounter[word]) {
                    articleHelper.wordCounter[word] += 1;
                } else {
                    articleHelper.wordCounter[word] = 1;
                }
            }
        }
    }

    countAndSortTopWords(articles, res);
}

// Given a list of all words found in all headlines, count the occurence
// of each of those words, then store the word and its number of
// occurences in a holder.
function countAndSortTopWords(articles, res) {
    for (var word in articleHelper.wordCounter) {
        var count       = articleHelper.wordCounter[word];

        // Given a threshold for popularity, filter out words
        // that have not occurred often enough.  This is a critical
        // aspect of the script's concept of popularity.
        if (count > articleHelper.topWordThreshold) {
            var item    = {};
            item.word   = word;
            item.count  = count;
            articleHelper.topWords.push(word);
            articleHelper.sortedWordCounter.push(item);
        }
    }

    // Sort the items based on count.
    articleHelper.sortedWordCounter =
        articleHelper.sortedWordCounter.sort(ascSort('count'));

    countTopWordsInHeadlines(articles, res);
}

// Now that a list of top words has been established and captured
// (in articleHelper.sortedWordCounter), iterate over all headlines,
// and look for a top word in the title.  Keep track of each headline
// and how many top words were found within it.
function countTopWordsInHeadlines(articles, res) {

    // This holds all the articles we want to remember.
    var results = [];

    // Hold titles, urls and word groups to avoid duplicate articles.
    var titleHolder = [];
    var urlHolder = [];
    var wordGroupHolder = [];

    for (var i = 0; i < articles.length; i++) {
        var article             = articles[i];
        var title               = article.title;

        // Which top words were found in the article title.
        var wordsFound  = [];

        for (var j = 0; j < articleHelper.topWords.length; j++) {
            var topWord         = articleHelper.topWords[j];
            var wordInHeadline  = title.indexOf(topWord) != -1;
            if (wordInHeadline) {
                wordsFound.push(topWord);
            }
        }

        var wordGroupString = wordsFound.join(' ');

        // This is part 2/2 of our popularity meter.  It asks how many top keywords
        // need to appear in a headline to qualify it for our popular feed. If it
        // meets the criteria, it is added to the list.
        var meetsWordThreshold =
            wordsFound.length > articleHelper.wordOccurenceThreshold
        var isNew = titleHolder.indexOf(title) == -1 &&
            urlHolder.indexOf(article.source_url) == -1 &&
            wordGroupHolder.indexOf(wordGroupString == -1);

        // If the article is actually considered popular, and if it is not
        // already recorded as popular, make it so!
        if (meetsWordThreshold && isNew) {

            results.push(article);
            titleHolder.push(title);
            urlHolder.push(article.source_url);
            wordGroupHolder.push(wordGroupString);
        }
    }

    // Render response of popular items.
    var response        = {}
    response.count      = results.length
    response.results    = results;
    res.json(response);
}

// Sort a multidimensional array by property.
function ascSort(prop) {
  return function(a, b) {
    if (a[prop] == b[prop]) return 0;
    return a[prop] > b[prop] ? -1 : 1;
  }
}
