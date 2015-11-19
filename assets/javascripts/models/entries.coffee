Entry   = require './entry.coffee'
_       = require 'underscore'

module.exports = Entries = class Entries
  entries: []
  hIndex: 0

  constructor: (array)->
    @setEntries(array) if array

  setIndex: (index)->
    @index = index

  all: ->
    @entries

  setActive:(bool)->
    @isActive=bool

  isEmpty: ->
    @entries.length is 0

  current: ->
    return null if _.isEmpty @entries
    @entries[@hIndex]

  setIndex: (index)->
    return unless 0 <= index < @entries.length
    @hIndex = index

  updateIndex: (amount)->
    return unless 0 <= @hIndex+amount < @entries.length
    @hIndex = @hIndex+amount

  setEntries: (array)->
    newEntries = array.map (entryHash)->
      new Entry(entryHash)

    @hIndex = Math.floor(array.length/2)
    @entries = newEntries
