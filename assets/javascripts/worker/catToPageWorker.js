import { fetch } from "./fetchJSON"

let catToPage

/*
  受け取るオブジェクト
    {
      cmd: 'init' | 'memberByMember',
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
        await init(e.data.arg, (progress) => {
          self.postMessage({ cmd: cmd, progress: progress})
        })
        console.log("done fetch catToPage")
        self.postMessage({ cmd: cmd, res: 'success' })
        break
      case 'memberByMember':
        console.log(e.data.arg)
        self.postMessage({ cmd: cmd, res: memberByMember(e.data.arg) })
        break
      default:
        self.postMessage({ cmd: cmd, res: "command not found" })
        break
    }
  })
}

const init = async (url, onProgress) => {
  catToPage = await fetch(`${url}/keycat.json`, onProgress)
  return
}

const memberByMember = categories => categories.map(cat => ({category: cat, entries: catToPage[cat]}))
