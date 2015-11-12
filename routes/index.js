var express = require('express');
var router = express.Router();
var bot = require('nodemw');

var keyword;

/* GET home page. */
router.get('/:word', function(req, res, next) {
	keyword = req.params.word
	var client = new bot({
		server: 'ja.wikipedia.org',
		path: '/w',
		debug: true
	}),
	params = {
		action: 'query',
		list: 'search',
		srsearch: keyword,
		srprop: 'snippet',
		srlimit: 100
	};
	client.api.call(params, function(err, info, next, data){
		var s = info.search;
		var resultList = [];
		for(var index in info.search){
			if(s[index].title.indexOf('曲') != -1 || s[index].title.indexOf('歌') != -1){
				console.log(s[index].title + "is 曲");
				console.log(s[index].snippet);
				resultList.push(s[index].title);
				continue;
				//これは曲ページだからresultListにappend
			}
			if(s[index].snippet.indexOf('曲') != -1 || s[index].snippet.indexOf('歌') != -1){
				console.log(s[index].title + "is 曲");
				console.log(s[index].snippet);
				resultList.push(s[index].title);
				//これは曲ページだからresultListにappend
			}
		};
		res.render('index', {
			title: 'Express',
			searchWord: keyword,
			result: resultList
		});
	});
});

module.exports = router;
