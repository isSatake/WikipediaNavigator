const express = require('express');
const router = express.Router();
const path = require('path')
const mysql = require('mysql2/promise')
const categoryFilter = require('../assets/javascripts/categoryFilter')
let db

async function initDB() {
  db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'wikipage'
  })
}

(async function(){
  await initDB().catch((err) => console.error(err))
})()

async function getCategoryMember(category) {
  const [rows, fields] = await db.execute(`select categorylinks.cl_to,page.page_title from categorylinks inner join page on categorylinks.cl_from = page.page_id where categorylinks.cl_to = '${category}'`)
  const member = []

  for(let row of rows){
    member.push(row.page_title.toString())
  }

  return member
}

function isNotCategory(title){
  for(let filter of categoryFilter){
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
  const categories = await getCategories(page)
  const members = []
  for(let category of categories){
    members.push({category: category, entries: await getCategoryMember(category)})
  }
  return members
}

//root
router.get('/:word', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// メンバからメンバ
router.get('/memberbymember/:word', async function(req, res){
  res.send(await member_by_member(req.params.word))
});

module.exports = router;
