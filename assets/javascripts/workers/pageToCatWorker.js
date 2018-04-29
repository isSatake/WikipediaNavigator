import { fetch } from "./fetchJSON"

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
        await init()
        console.log("done fetch pageToCat")
        self.postMessage({ cmd: cmd, res: 'success' })
        break
      case 'getCategories':
        self.postMessage({ cmd: cmd, res: getCategories(e.data.arg) })
        break
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

const init = async () => {
  pageToCat = await fetch("keypage.json")
  keys = Object.keys(pageToCat)
  return
}

const getCategories = pageTitle => pageToCat[pageTitle]

const getRandomPage = () => keys[Math.floor(Math.random() * (keys.length + 1))]

const searchByTitle = queryTitle => keys.filter(title => title.indexOf(queryTitle) === 0)
