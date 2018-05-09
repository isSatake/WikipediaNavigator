import {Router} from "express"
import * as axios from "axios"
import * as cheerio from "cheerio"

const router = Router()

router.get('/image/:title', async (req, res) => {
  const $ = await htmlParser(req.params.title)
  const thumbnail = $('img.thumbimage').attr('src')
  const img = thumbnail === undefined ? $('img').attr('src') : thumbnail
  res.send(`https:${img}`).status(200).end()
})

router.get('/link/:title', async (req, res) => {
  const $ = await htmlParser(req.params.title)
  const links = $('#mw-content-text a[title]').toArray().filter(element => /\/wiki\/.*/.test(element.attribs.href)).map(element => element.attribs.title)
  res.send(links).status(200).end()
})

const htmlParser = async (pageTitle) => {
  const res = await axios.get(`https://ja.wikipedia.org/wiki/${encodeURI(pageTitle)}`)
  return cheerio.load(`${res.data}`)
}

module.exports = router
