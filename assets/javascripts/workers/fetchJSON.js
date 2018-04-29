import Request from "superagent"

exports.fetch = async (fileName) => {
  const res = await Request.get(`http://localhost:3000/${fileName}`).on('progress', (e) => console.log("event"))
  return JSON.parse(res.text)
}
