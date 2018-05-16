import { fetch } from "./fetchJSON"

const excludedCategories = require('./excludedCategories')
let pageToCat, keys

/*
  受け取るオブジェクト
    {
      cmd: 'init' | 'getCategories' | 'getRandomPage' | 'searchByTitle',
      arg: String
    }

  返すオブジェクト
    {
      cmd: 同上,
      res: 'success' | Object
    }
*/

module.exports = function(self){
  self.addEventListener('message', async (e) => {
    const cmd = e.data.cmd
    switch(cmd){
      case 'init':
        console.log("start fetch pageToCat")
        await init(e.data.arg, (progress) => {
          self.postMessage({
            cmd: cmd,
            progress: {
              type: "pageToCat",
              progress: progress
            }
          })
        })
        console.log("done fetch pageToCat")
        self.postMessage({ cmd: cmd, res: 'success' })
        break
      case 'getCategories':
        console.log(`pageToCatWorker:onGetCategories:${e.data.arg}`)
        self.postMessage({ cmd: cmd, res: getCategories(e.data.arg) })
        break
      case 'getPageList':
        self.postMessage({ cmd: cmd, res: keys })
      case 'getRandomPage':
        self.postMessage({ cmd: cmd, res: getRandomPage() })
        break
      case 'searchByTitle':
        self.postMessage({ cmd: cmd, res: searchByTitle(e.data.arg) })
        break
      default:
        self.postMessage({ cmd: cmd, res: "command not found" })
        break
    }
  })
}

const init = async (url, onProgress) => {
  pageToCat = await fetch(`${url}/keypage.json`, onProgress)
  keys = Object.keys(pageToCat)
  return
}

const isNotCategory = (title) => {
  for(let filter of excludedCategories){
    if(title.indexOf(filter) >= 0){
      return true
    }
  }
}

const getCategories = (pageTitle) => {
  const categories = pageToCat[pageTitle]
  console.log(`pageToCatWorker:categories:${categories}`)
  if(categories == undefined){
    return []
  }
  return categories.filter(category => !isNotCategory(category))
}
const getRandomPage = () => {
  console.log(`pageToCatWorker:getRandomPage`)
  const title = keys[Math.floor(Math.random() * (keys.length + 1))]
  if(getCategories(title).length == 0){
    return getRandomPage()
  }
  return title
}

const searchByTitle = queryTitle => keys.filter(title => title.indexOf(queryTitle) === 0)
