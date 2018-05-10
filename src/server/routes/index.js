import {Router} from "express"
import * as axios from "axios"
import * as cheerio from "cheerio"
import path from "path";

const router = Router()

router.get('/:word', function(req, res) {
  res.sendFile(path.join(__dirname, '../../../public/index.html'));
});

router.get('/image/:title', async (req, res) => {
  console.log('img:title ' + req.params.title)
  const $ = await htmlParser(req.params.title)
  if(!$){
    res.status(404).end()
    return
  }
  const thumbnail = $('img.thumbimage').attr('src')
  const img = thumbnail === undefined ? $('img').attr('src') : thumbnail
  if(!img){
    res.status(404).end()
    return
  }
  res.send(`https:${img}`).status(200).end()
})

router.get('/link/:title', async (req, res) => {
  const $ = await htmlParser(req.params.title)
  const links = $('#mw-content-text a[title]').toArray().filter(element => /\/wiki\/.*/.test(element.attribs.href)).map(element => element.attribs.title)
  res.send(links).status(200).end()
})

const htmlParser = async (pageTitle) => {
  const res = await axios.get(`https://ja.wikipedia.org/wiki/${encodeURI(pageTitle)}`).catch(() => null)
  if(!res){
    return null
  }
  return cheerio.load(`${res.data}`)
}

module.exports = router
