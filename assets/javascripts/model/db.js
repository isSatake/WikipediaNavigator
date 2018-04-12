import Request from "superagent"

exports.memberByMember = async (query) => {
  const res = await Request.get(`/memberbymember/${encodeURIComponent(query)}`)
  return res.body
}

exports.getImage = async (title) => {
  // const res = await db.execute(`select url from image where title = ${db.escape(title)}`)
  // if(res[0].length == 0){
  //   console.log(title)
  //   // const res = await Request.get(`${BING_URL}${encodeURIComponent(title)}`).set("Ocp-Apim-Subscription-Key", "3ebf24197a5a4366b937f25e14869320")
  //   const { err, $, res, body } = await client.fetch("http://image.search.yahoo.co.jp/search?", { n: 1, p: title })
  //   console.log($("a img")[0])
  //   // if(res.body.value[0]){
  //   //   const url = res.body.value[0].thumbnailUrl
  //   //   db.execute(`insert into image values(${db.escape(title)}, '${url}')`).catch((e) => {})
  //   //   return url
  //   // }
    return ""
  // } else {
  //   return res[0][0].url
  // }
}

exports.getRandomPage = async () => {
  const res = await Request.get(`/getrandompage/`)
  return res.text
}

exports.searchByTitle = async (query) => {
  const res = await Request.get(`/searchbytitle/${query}`)
  return res.body[0]
}
