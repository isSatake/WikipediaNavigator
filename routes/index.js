const express = require('express');
const router = express.Router();
const path = require('path')
const mysql = require('mysql2/promise')
const Request = require('superagent')
const debug = require('debug')('index')
const SLOW_QUERY_THRESHOLD = 5000
const BING_URL = 'https://api.cognitive.microsoft.com/bing/v7.0/images/search?count=1&q='
let db
let excludedCategories = []

async function initDB() {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  })
}

(async function(){
  require('dotenv').config()
  await initDB().catch((err) => console.error(err))
  await db.execute('set names utf8')
  const rows = await db.execute('select * from excludedcategories;')
  for(let row of rows[0]){
    excludedCategories.push(row.title)
  }
})()

function excludeCategory(title) {
  db.execute(`insert into excludedcategories values('${mysql.escape(title)}')`)
  excludedCategories.push(title)
}

async function getCategoryMember(category) {
  const startTime = new Date().getTime()
  const [rows, fields] = await db.execute(`select categorylinks.cl_to,page.page_title from categorylinks inner join page on categorylinks.cl_from = page.page_id where categorylinks.cl_to = '${mysql.escape(category)}'`)
  const elapsedTime = new Date().getTime() - startTime

  // if(elapsedTime > SLOW_QUERY_THRESHOLD){
  //   console.log(`Slow query detected! Category:${category}`)
  //   excludeCategory(category)
  // }

  const member = []
  for(let row of rows){
    member.push(row.page_title.toString())
  }

  return member
}

function isNotCategory(title){
  for(let filter of excludedCategories){
    if(title.indexOf(filter) >= 0){
      return true
    }
  }
}

async function getCategories(page) {
  const [rows, fields] = await db.execute(`select page.page_title,categorylinks.cl_to from page inner join categorylinks on page.page_id = categorylinks.cl_from where page.page_title = '${mysql.escape(page)}';`)
  const categories = []

  for(let row of rows){
    const title = row.cl_to.toString()
    if(isNotCategory(title)){
      continue
    }
    categories.push(row.cl_to.toString())
  }
  return categories
}

async function memberByMember(page){
  debug(`memberByMember ${page}`)
  const categories = await getCategories(page)
  const members = []
  for(let category of categories){
    members.push({category: category, entries: await getCategoryMember(category)})
  }
  return members
}

async function getImage(title){
  const res = await db.execute(`select url from image where title = '${mysql.escape(title)}'`)
  if(res[0].length == 0){
    const res = await Request.get(`${BING_URL}${encodeURIComponent(title)}`).set("Ocp-Apim-Subscription-Key", "3ebf24197a5a4366b937f25e14869320")
    if(res.body.value[0]){
      const url = res.body.value[0].thumbnailUrl
      db.execute(`insert into image values('${mysql.escape(title)}', '${url}')`)
      return url
    }
    return ""
  } else {
    return res[0][0].url
  }
}

router.get('/:word', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/memberbymember/:word', async function(req, res){
  res.send(await memberByMember(req.params.word))
});

router.get('/getimage/:word', async function(req, res){
  res.send(await getImage(req.params.word))
})

module.exports = router;
