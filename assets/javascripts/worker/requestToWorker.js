const work = require("webworkify")
const url = location.hostname == "localhost" ? "http://localhost:3000" : "http://wn.stkay.com"
let pageToCatWorker, catToPageWorker

const requestInitPageToCat = (onProgress) => {
  return new Promise((resolve, reject) => {
    console.log("wikipedia:requestInitPageToCat")
    pageToCatWorker = work(require("./pageToCatWorker.js"))
    pageToCatWorker.postMessage({ cmd: 'init', arg: url })
    pageToCatWorker.onmessage = (e) => {
      if(e.data.cmd != 'init') {
        return
      }
      if(e.data.progress) {
        onProgress(e.data.progress)
      }
      if(e.data.res == "success"){
        resolve()
      }
    }
  })
}

const requestInitCatToPage = (onProgress) => {
  return new Promise((resolve, reject) => {
    console.log("wikipedia:requestInitCatToPage")
    catToPageWorker = work(require("./catToPageWorker.js"))
    catToPageWorker.postMessage({ cmd: 'init', arg: url })
    catToPageWorker.onmessage = (e) => {
      if(e.data.cmd != 'init') {
        return
      }
      if(e.data.progress) {
        onProgress(e.data.progress)
      }
      if(e.data.res == "success"){
        resolve()
      }
    }
  })
}

const requestGetCategories = (title) => {
  console.log(`wikipedia:requestGetCategories:${title}`)
  return new Promise((resolve, reject) => {
    pageToCatWorker.postMessage({ cmd: 'getCategories', arg: title })
    pageToCatWorker.onmessage = (e) => {
      if(e.data.cmd != 'getCategories'){
        return
      }
      resolve(e.data.res)
    }
  })
}

exports.requestInit = async(onProgress) => {
  const combineProgress = (progress) => {
    console.log(progress)
    if(progress.type == "catToPage"){
      onProgress(100 + progress.progress)
      return
    }
    onProgress(progress.progress)
  }
  await requestInitPageToCat(combineProgress)
  await requestInitCatToPage(combineProgress)
}

exports.requestMemberByMember = (title) => {
  console.log(`wikipedia:requestMemberByMember:${title}`)
  return new Promise(async (resolve, reject) => {
    catToPageWorker.postMessage({ cmd: 'memberByMember', arg: await requestGetCategories(title) })
    catToPageWorker.onmessage = (e) => {
      if(e.data.cmd != 'memberByMember'){
        return
      }
      resolve(e.data.res)
    }
  })
}

exports.requestGetRandomPage = () => {
  console.log("wikipedia:requestGetRandomPage")
  return new Promise(async (resolve, reject) => {
    pageToCatWorker.postMessage({ cmd: 'getRandomPage' })
    pageToCatWorker.onmessage = (e) => {
      if(e.data.cmd != 'getRandomPage'){
        return
      }
      resolve(e.data.res)
    }
  })
}

exports.requestSearchByTitle = (queryTitle) => {
  console.log(`wikipedia:requestSearchByTitle:${queryTitle}`)
  return new Promise(async (resolve, reject) => {
    pageToCatWorker.postMessage({ cmd: 'searchByTitle', arg: queryTitle })
    pageToCatWorker.onmessage = (e) => {
      if(e.data.cmd != 'searchByTitle'){
        return
      }
      resolve(e.data.res)
    }
  })
}
