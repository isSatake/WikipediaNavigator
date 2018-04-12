const mysql = require('mysql2/promise')
const debug = require('debug')('db')
let db

exports.init = async function initDB() {
  require('dotenv').config()
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME
  })
  await db.execute('set names utf8')
}

exports async function getCategoryMember(category) {
  const startTime = new Date().getTime()
  const [rows, fields] = await db.execute(`select categorylinks.cl_to,page.page_title from categorylinks inner join page on categorylinks.cl_from = page.page_id where categorylinks.cl_to = ${db.escape(category)}`)
  const elapsedTime = new Date().getTime() - startTime

  // if(elapsedTime > SLOW_QUERY_THRESHOLD){
  //   console.log(`Slow query detected! Category:${category}`)
  //   excludeCategory(category)
  // }

  return rows
}
