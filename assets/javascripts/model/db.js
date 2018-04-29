import Request from "superagent"

const work = require("webworkify")
let pages, pageToCat, catToPage

// const pageToCatWorker = work(require("../workers/pageToCatWorker.js"))
// pageToCatWorker.postMessage({ cmd: 'init' })
// pageToCatWorker.onmessage = (e) => {
//   switch(e.data.cmd){
//     case 'init':
//       console.log(e.data.res)
//       pageToCatWorker.postMessage({ cmd: 'getCategories', arg: 'リクルート事件' })
//       break
//     case 'getCategories':
//       console.log(e.data.res)
//       break
//   }
// }
//
// const catToPageWorker = work(require("../workers/catToPageWorker.js"))
// catToPageWorker.postMessage({ cmd: 'init' })
// catToPageWorker.onmessage = (e) => {
//   switch(e.data.cmd){
//     case 'init':
//       console.log(e.data.res)
//       catToPageWorker.postMessage({ cmd: 'getPages', arg: '企業犯罪' })
//       break
//     case 'getPages':
//       console.log(e.data.res)
//       break
//   }
// }


exports.memberByMember = async (page) => {
  // const res = await Request.get(`/memberbymember/${encodeURIComponent(page)}`)
  // console.log(res.body)
  // return res.body

  const obj = {}
  const categories = pageToCat[page]
  for(const category of categories){
    obj.category = category
    obj.entries = catToPage[category]
  }

  return obj
}

exports.getImage = async (title) => {
  // const res = await db.execute(`select url from image where title = ${db.escape(title)}`)
  // if(res[0].length == 0){
  //   console.log(title)
  //   // const res = await Request.get(`${BING_URL}${encodeURIComponent(title)}`).set("Ocp-Apim-Subscription-Key", "3ebf24197a5a4366b937f25e14869320")
  //   const { err, $, res, body } = await client.fetch("http://image.search.yahoo.co.jp/search?", { n: 1, p: title })
  //   console.log($("a img")[0])
  //   // if(res.body.value[0]){
  //   //   const url = res.body.value[0].thumbnailUrl
  //   //   db.execute(`insert into image values(${db.escape(title)}, '${url}')`).catch((e) => {})
  //   //   return url
  //   // }
    return ""
  // } else {
  //   return res[0][0].url
  // }
}

exports.getRandomPage = async () => {
  const res = await Request.get(`/getrandompage/`)
  return res.text
}

exports.searchByTitle = (query) => {
  const res = []
  for(const page of pages){
    if(page.title.indexOf(query.value) === 0){
      res.push(page.title)
    }
  }
  return res
}

// exports.searchByTitle = async (query) => {
  // const res = await Request.get(`/searchbytitle/${query}`)
  // return res.body[0]
// }
