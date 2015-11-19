
module.exports = Entry =  class Entry

  constructor: (entryHash)->
    @id = entryHash['id']
    @title = entryHash['title']
    @description = entryHash['description']
    @imageUrl = "//haishin.ebookjapan.jp/contents/images-m/#{entryHash['image_url']}"
    @permalink = "http://google.com"
