import Request from "superagent"

exports.fetch = async (fileName) => {
  const res = await Request.get(`http://pivotpedia.stkay.com/${fileName}`)//.on('progress', (e) => console.log("event"))
  //workerからリクエストするには絶対URLが必要っぽい
  //workerはどこにいるんだ？
  return JSON.parse(res.text)
}
