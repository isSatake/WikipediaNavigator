import Request from "superagent"

const work = require("webworkify")
let pages, pageToCat, catToPage

// const requestMemberByMember = (queryTitle) => {
//   return new Promise((resolve, reject) => {
//     pageToCatWorker.postMessage({ cmd: 'getCategories', arg: queryTitle })
//     pageToCatWorker.onmessage = (e) => {
//       if(e.data.cmd != 'getCategories'){
//         return
//       }
//       e.data.res //カテゴリリスト
//     }
//   })
// }

const pageToCatWorker = work(require("./workers/pageToCatWorker.js"))
pageToCatWorker.postMessage({ cmd: 'init' })
pageToCatWorker.onmessage = (e) => {
  switch(e.data.cmd){
    case 'init':
      console.log(e.data.res)
      pageToCatWorker.postMessage({ cmd: 'getCategories', arg: '増井歩' })
      break
    case 'getCategories':
      console.log(e.data.res)
      break
  }
}

// const catToPageWorker = work(require("./workers/catToPageWorker.js"))
// catToPageWorker.postMessage({ cmd: 'init' })
// catToPageWorker.onmessage = (e) => {
//   switch(e.data.cmd){
//     case 'init':
//       console.log(e.data.res)
//       catToPageWorker.postMessage({ cmd: 'memberByMember', arg: ['企業犯罪', '1959年生'] })
//       break
//     case 'memberByMember':
//       console.log(e.data.res)
//       break
//   }
// }

exports.memberByMember = async (queryTitle) => {
  //ページ名が渡される
  //カテゴリをリストする
  //カテゴリ毎にページをリストする
  //{ [ category: String, entries: [ String, ] ], [], }
  const obj = {}
  // pageToCat[queryTitle].map(cat => obj.push({ category: cat, entries: catToPage[cat] }))
  return obj
}

exports.getRandomPage = () => {
  return "増井俊之"//res.text
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
