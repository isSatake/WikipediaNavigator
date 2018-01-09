var express = require('express');
var router = express.Router();
var bot = require('nodemw');
var google = require('googleapis');
var YOUTUBE_API_KEY = "--YOUR_API_KEY";
var youtube = google.youtube('v3');
var _ = require('underscore');
// var MongoClient = require('mongodb').MongoClient;

// database
// db = null;
// MongoClient.connect('mongodb://localhost:27017/tuneturn', function(err,_db){
//   if(err != null){ throw err };
//   db = _db;
// });

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
  return new Promise(function(resolve, reject){
    bot_list_categories.api.call(params, function(err, info, next, data){
      categories = Object.keys(info.pages).map(function(id){
        return info.pages[id].categories.map(function(category){
          var v = category.title
          //ゴミ削除
          if(v.indexOf('ウィキデータ') >= 0 || v.indexOf('出展を必要とする') >= 0 || v.indexOf('スタブ') >= 0 || v.indexOf('参照エラー') >= 0 ||
           v.indexOf('参照方法') >= 0 || v.indexOf('外部リンク') >= 0 || v.indexOf('中立的観点') >= 0){
            return null;
          }
          return v;
        }).filter(function(title){ return title !== null });
      });
      resolve(_.flatten(categories));
    });
  });
}

//カテゴリメンバ抽出クエリ
var params_search_by_category = {
  action: 'query',
  list: 'categorymembers',
  cmtitle: '',
  cmprop: 'title',
  cmlimit: 20
};

var bot_search_by_category = new bot({
  server: 'ja.wikipedia.org',
  path: '/w',
  debug: true
});

function search_by_category(params){
  return new Promise(function(resolve, reject){
    bot_search_by_category.api.call(params, function(err, info, next, data){
      try{
        resolve(info.categorymembers.map(function(member){
          var v = member.title
          //ゴミ削除
          if(v.indexOf('Category') >= 0 || v.indexOf('Template') >= 0 || v.indexOf('一覧') >= 0 || v.indexOf('ISBN') >= 0){
            return null;
          }
          return v;
        }).filter(function(member){ return member !== null }));
      }catch(e){
        resolve();
      }
    });
  });
}

function member_by_member(word){
  return new Promise(function(resolve, reject){
    var list_params = _.extend(params_list_categories, { titles: word });
    list_categories(list_params).then(function onFullfilled(categories){
      Promise.all(categories.map(function(category){
        var search_params = _.clone(_.extend(params_search_by_category, { cmtitle: category }));
        return search_by_category(search_params);
      })).then(function onFullfilled(members){
        var result = [];
        categories.forEach(function(category, cindex){
          members[cindex].forEach((entry, index) => {
            if(entry.indexOf("Wikipedia:") >= 0){
              members[cindex].splice(index, 1)
            }
          })
          return result.push([category, members[cindex]]);
        });
        resolve(result);
      });
    });
  });
}

//root
router.get('/:word', function(req, res, next) {
  res.sendfile('./public/index.html');
});

//カテゴリリスト取得API
router.get('/categorylist/:word', function(req, res){
  list_categories(_.clone(_.extend(params_list_categories, {titles: req.params.word}))).then(function onFulfilled(value_list_categories){
    res.send(value_list_categories);
  });
});

//カテゴリメンバ取得API
router.get('/categorymember/:word', function(req, res){
  search_by_category(_.clone(_.extend(params_search_by_category, {cmtitle: req.params.word}))).then(function onFulfilled(value_members){
    res.send(value_members);
  });
});

// メンバからメンバ
router.get('/memberbymember/:word', function(req, res){
  // db.collection('member_by_member').findOne({ word: req.params.word } , function(err, doc){
  //   if(err != null) { return res.send(err); };
  //   if(doc != null){ return res.send(doc.results); };

    member_by_member(req.params.word).then(function onFullfilled(results){
      // db.collection('member_by_member').insert({ word: req.params.word, results: results});
      res.json(results);
    });
  // });
});


module.exports = router;
