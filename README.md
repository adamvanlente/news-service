## news-service
a node app that accepts a list of (RSS) news sources and offers endpoints for making use of them.

### usage

###### cron job

The news service offers an endpoint that can be run like a cron job.  Instead of running the script as a cron, you can reach the endpoint

	/cron

and run as often as you like.  When this url is curled, it dumps any (new) new stories into the database.

#### endpoints

The app has two endpoints baked in currently.

###### all news stories

	// Paginated news stories, newest to oldest.
	/api/v1/news/{STARTING_INDEX}

	// Example query
	/api/v1/news/40

	// Example result.  Does not actually contain ellipses as picture
	// below - just trying to keep the README neat.  Results are
	// paginated with 20 items per page.
	"count": 20,
	"results": [
		{
			"itemId": "Blake Shelton Welcomes New Coaches...",
			"title": "Blake Shelton Welcomes New Coaches...",
			"content": "Blake Shelton ...",
			"date": "2014-09-17T21:47:00.000Z",
			"source": "CMT News",
			"author": "",
			"source_url": "http://someUrl",
			"type": "news",
			"_id": "someid",
			"votes": "0"
		},... // 19 more results
	"next_page": "/api/v1/news/60" }]

###### search news stories

	// Paginated news stories, newest to oldest.
	/api/v1/news/search/{SEARCH_TERM}

	// Example query
	/api/v1/news/search/Blake Shelton

	// Example result.  Non paginated results.
	"count": 1,
	"results": [
		{
			"itemId": "Blake Shelton Welcomes New Coaches...",
			"title": "Blake Shelton Welcomes New Coaches...",
			"content": "Blake Shelton ...",
			"date": "2014-09-17T21:47:00.000Z",
			"source": "CMT News",
			"author": "",
			"source_url": "http://someUrl",
			"type": "news",
			"_id": "someid",
			"votes": "0"
		}]

###### top news stories

	// Paginated news stories, newest to oldest.
	/api/v1/topnews

	// Result is same format as above, non paginated.


### setup

###### clone this repo and install npm packages

	git clone https://github.com/adamvanlente/news-service

  cd news-service

	npm install

###### create a mongo db

	// The app assumes the mongo port is 27017.  Change port in
	// config files if necessary.

	mongo

	use DATABASE_NAME

	db.addUser(
		{
		  user: "USERNAME",
		  pwd: "PASSWORD",
	      roles: [
	        "readWrite", "dbAdmin"
	        // Or as you wish
	      ]
    });

##### update config files

update <b>/config/database-sample.js</b> and rename to <b>/config/database.js</b>

update <b>/config/feed-list-sample.js</b> and rename to <b>/config/feed-list.js</b>
