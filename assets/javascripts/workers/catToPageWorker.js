import { fetch } from "./fetchJSON"

let catToPage

/*
  受け取るオブジェクト
    {
      cmd: 'init' | 'getPages',
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
        console.log("start fetch catToPage")
        catToPage = await fetch("keycat.json")
        console.log("done fetch catToPage")
        self.postMessage({ cmd: cmd, res: 'success' })
        break
      case 'getPages':
        self.postMessage({ cmd: cmd, res: getPages(e.data.arg) })
        break
      case 'getRandomPage':
        break
      case 'searchByTitle':
        break
    }
  })
}

const getPages = (catTitle) => {
  return catToPage[catTitle]
}
