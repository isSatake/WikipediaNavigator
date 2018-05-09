import { requestInit, requestMemberByMember, requestGetRandomPage, requestSearchByTitle } from "./worker/requestToWorker"
let pages, pageToCat, catToPage

exports.initWikipedia = async (onProgress) => await requestInit(onProgress)

exports.memberByMember = async title => await requestMemberByMember(title)

exports.getRandomPage = async () => await requestGetRandomPage()

exports.searchByTitle = async queryTitle => await requestSearchByTitle(queryTitle)
