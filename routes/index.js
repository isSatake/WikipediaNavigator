var express = require('express');
var router = express.Router();
var bot = require('nodemw');

var musicTitle; //検索用の曲
var categoryList; //検索曲ページが含むカテゴリのリストObject
var musicList = []; //選択カテゴリのメンバ内楽曲ページArray

//カテゴリ抽出クエリ
var params_list_categories = {
  action: 'query',
  prop: 'categories',
  titles: musicTitle
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

function search_by_category(params, array){
  return new Promise(function(resolve, reject){
    bot_search_by_category.api.call(params_search_by_category, function(err, info, next, data){
      if(info.categorymembers.length = 0){
        return true;
      }
      var c = info.categorymembers;
      for(var index in c){
        array.push(c[index].title);
      }
      resolve();
    });
  });
}

/* GET home page. */
router.get('/:word', function(req, res, next) {
  musicTitle = req.params.word;
  params_list_categories.titles = musicTitle;

  list_categories(params_list_categories).then(function onFulfilled(value_list_categories){
    res.render('index', {
      musicTitle: musicTitle,
      categoryList: value_list_categories
    });

    for(var index in value_list_categories){
      params_search_by_category.cmtitle = value_list_categories[index].title
      search_by_category(params_search_by_category, musicList).then(function onFulfilled(){
      }).catch(function onRejected(error){
        console.log("search_by_category_error");
      });
    }
//    res.render('index', {
//      musicList: musicList
//    });

  }).catch(function onRejected(error){
    console.log("list_categories_error");
  });

});

module.exports = router;
