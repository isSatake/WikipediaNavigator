var express = require('express');
var router = express.Router();
var bot = require('nodemw');

var categories;
var title;

/* GET home page. */
router.get('/:word', function(req, res, next) {
	title = req.params.word
	var client = new bot({
		server: 'ja.wikipedia.org',
		path: '/w',
		debug: true
	}),
	params = {
		action: 'query',
		prop: 'categories',
		titles: title
	};
	client.api.call(params, function(err, info, next, data){
		for(var id in info.pages){
			//		for(var index in info.pages[id].categories){
			//			console.log(info.pages[id].categories[index].title);
			//<li>をjadeに吐き出す
			//		}
			categories = info.pages[id].categories;
		}
		res.render('index', {
			title: 'Express',
			musicTitle: title,
			categoriesList: categories
		});
	});
});

module.exports = router;
