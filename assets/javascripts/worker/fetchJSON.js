import Request from "superagent"

exports.fetch = async (url, onProgress) => {
  const res = await Request.get(url).on('progress', (e) => onProgress(e.percent))
  return JSON.parse(res.text)
}
