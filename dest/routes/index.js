"use strict";

var _express = require("express");

var _axios = require("axios");

var axios = _interopRequireWildcard(_axios);

var _cheerio = require("cheerio");

var cheerio = _interopRequireWildcard(_cheerio);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const router = (0, _express.Router)();

router.get('/image/:title', (() => {
  var _ref = _asyncToGenerator(function* (req, res) {
    console.log('img:title ' + req.params.title);
    const $ = yield htmlParser(req.params.title);
    if (!$) {
      res.status(404).end();
      return;
    }
    const thumbnail = $('img.thumbimage').attr('src');
    const img = thumbnail === undefined ? $('img').attr('src') : thumbnail;
    if (!img) {
      res.status(404).end();
      return;
    }
    res.send(`https:${img}`).status(200).end();
  });

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
})());

router.get('/link/:title', (() => {
  var _ref2 = _asyncToGenerator(function* (req, res) {
    const $ = yield htmlParser(req.params.title);
    const links = $('#mw-content-text a[title]').toArray().filter(function (element) {
      return (/\/wiki\/.*/.test(element.attribs.href)
      );
    }).map(function (element) {
      return element.attribs.title;
    });
    res.send(links).status(200).end();
  });

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
})());

const htmlParser = (() => {
  var _ref3 = _asyncToGenerator(function* (pageTitle) {
    const res = yield axios.get(`https://ja.wikipedia.org/wiki/${encodeURI(pageTitle)}`).catch(function () {
      return null;
    });
    if (!res) {
      return null;
    }
    return cheerio.load(`${res.data}`);
  });

  return function htmlParser(_x5) {
    return _ref3.apply(this, arguments);
  };
})();

module.exports = router;