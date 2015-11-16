var express = require('express');
var router = express.Router();
var bot = require('nodemw');
var google = require('googleapis');
var YOUTUBE_API_KEY = "--YOUR_API_KEY";
var youtube = google.youtube('v3');

//カテゴリ抽出クエリ
var params_list_categories = {
  action: 'query',
  prop: 'categories',
  titles: 'title'
};

var bot_list_categories = new bot({
  server: 'ja.wikipedia.org',
  path: '/w',
  debug: true
});

function list_categories(params){
  var list;
  return new Promise(function(resolve, reject){
    bot_list_categories.api.call(params, function(err, info, next, data){
      for(var id in info.pages){
        list = info.pages[id].categories;
      }
      resolve(list);
    });
  });
}

//カテゴリメンバ抽出クエリ
var params_search_by_category = {
  action: 'query',
  list: 'categorymembers',
  cmtitle: '',
  cmprop: 'title',
  cmlimit: 100
};

var bot_search_by_category = new bot({
  server: 'ja.wikipedia.org',
  path: '/w',
  debug: true
});

function search_by_category(params){
  return new Promise(function(resolve, reject){
    bot_search_by_category.api.call(params_search_by_category, function(err, info, next, data){
      if(info.categorymembers.length == 0){
        return true;
      }
      resolve(info.categorymembers);
    });
  });
}

//root
router.get('/:word', function(req, res, next) {
  res.render('index', {
    musicTitle: req.params.word
  });
});

//カテゴリリスト取得API
router.get('/categorylist/:word', function(req, res){
  params_list_categories.titles = req.params.word;
  list_categories(params_list_categories).then(function onFulfilled(value_list_categories){
    res.send(value_list_categories);
  });
});

//カテゴリメンバ取得API
router.get('/categorymember/:word', function(req, res){
  params_search_by_category.cmtitle = req.params.word;
  search_by_category(params_search_by_category).then(function onFulfilled(value_list_categories){
    res.send(value_list_categories);
  });
});

//youtube取得API
router.get('/getmusic/:word', function(req, res){
  youtube.search.list({
    part:'snippet',
    q: req.params.word,
    key: 'AIzaSyBM5VAZ5s55MG16GrbY4NC0fAlC6eYp0hY'
  }, function(error, response){
    res.send(response.items[0].id.videoId);
  });
});


module.exports = router;
