import Request from "superagent"

exports.fetch = async (url) => {
  const res = await Request.get(url).on('progress', (e) => console.log(e))
  return JSON.parse(res.text)
}
