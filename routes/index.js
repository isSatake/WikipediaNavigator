const express = require('express');
const router = express.Router();
const path = require('path')
const mysql = require('mysql2/promise')
const debug = require('debug')('index')
const SLOW_QUERY_THRESHOLD = 2500
let db
let excludedCategories = []

async function initDB() {
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'wikipage'
  })
}

(async function(){
  await initDB().catch((err) => console.error(err))
  const rows = await db.execute('select * from excludedcategories;')
  for(let row of rows[0]){
    excludedCategories.push(row.title)
  }
})()

function excludeCategory(title) {
  db.execute(`insert into excludedcategories values('${title}')`)
  excludedCategories.push(title)
}

async function getCategoryMember(category) {
  const startTime = new Date().getTime()
  const [rows, fields] = await db.execute(`select categorylinks.cl_to,page.page_title from categorylinks inner join page on categorylinks.cl_from = page.page_id where categorylinks.cl_to = '${category}'`)
  const elapsedTime = new Date().getTime() - startTime

  if(elapsedTime > SLOW_QUERY_THRESHOLD){
    console.log(`Slow query detected! Category:${category}`)
    excludeCategory(category)
  }

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
  const [rows, fields] = await db.execute(`select page.page_title,categorylinks.cl_to from page inner join categorylinks on page.page_id = categorylinks.cl_from where page.page_title = '${page}';`)
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

async function list_categories(title){
  return await getCategories(title)
}

async function member_by_member(page){
  debug(`member_by_member ${page}`)
  const categories = await getCategories(page)
  const members = []
  for(let category of categories){
    members.push({category: category, entries: await getCategoryMember(category)})
  }
  return members
}

router.get('/:word', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

router.get('/memberbymember/:word', async function(req, res){
  res.send(await member_by_member(req.params.word))
});

module.exports = router;
