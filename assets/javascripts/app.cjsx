'use strict'

React          = require 'react'
ReactDOM       = require 'react-dom'
YouTube        = require 'react-youtube'

_              = require 'underscore'
request        = require 'superagent'

Shelf          = require './views/shelf.cjsx'

COLUMNS_SIZE = 6

App = React.createClass

  getInitialState: ->
    query: ""
    entryClusters: []
    vIndex: 0
    hIndex: 0
    youtubeUrl: ""

  ### Interface ###
  componentDidMount: ->
    @updateQuery decodeURI(location.pathname.replace('/',''))
    ReactDOM
    .findDOMNode(@)
    .offsetParent
    .addEventListener 'keydown', (e)=>
      return unless e.keyCode in [37,38,39,40]
      e.preventDefault()
      switch e.keyCode
        when 38 # up
          return if @state.hIndex <= 0
          @setState
            hIndex: @state.hIndex-1
          @waitForSelect()
        when 40 # down
          return if @state.hIndex >= @currentEntries().length
          @setState
            hIndex: @state.hIndex+1
          @waitForSelect()
        when 37 # left
          return if @state.vIndex <= 0
          @setState
            vIndex: @state.vIndex-1
          @waitForSelect()
        when 39 # right
          return if @state.vIndex >= @state.entryClusters.length
          @setState
            vIndex: @state.vIndex+1
          @waitForSelect()

  currentEntries: ->
    @state.entryClusters[@state.vIndex]

  currentCategory: ->
    return "" unless @state.entryClusters.length > 0
    @state.entryClusters[@state.vIndex][0]

  nowWaiting: false
  waitForSelect: ->
    return if @nowWaiting
    @nowWaiting = true
    setTimeout =>
      @openQuery()
      @nowWaiting = false
    , 1000 * 1 # 1 sec

  ### Network ###
  updateQuery: (query)->
    return if _.isEmpty query
    return if query is @state.query
    @setState query: query
    request "/memberbymember/#{query}"
    .end (err, res)=>
      return throw err if err
      # insert current entries

      result = []
      res.body.forEach (cluster, index)=>
        label = cluster[0]
        if index is @state.vIndex and @state.entryClusters.length > 0
          result.push @currentEntries()
        return if index >= COLUMNS_SIZE
        return if label is @currentCategory()
        result.push res.body[index]
      @setState entryClusters: result

  # find query and open youtube
  openQuery: ->
    @updateQuery(@currentEntries()[1][@state.hIndex])
    request "/getmusic/#{@state.query}"
    .end (err, res)=>
      @setState
        youtubeUrl: "http://www.youtube.com/watch?v=#{res.text}"

  ### Styles and Markups ###
  render: ->
    <div className="container-fluid">
      <div className="row">
        <p>start with {@state.query}</p>

        {@state.entryClusters.map (cluster, index)=>
          <div className="col-xs-2">
            <h5>{cluster[0]}</h5>
            <Shelf
              entries={cluster[1]}
              isActive={@state.vIndex is index}
              hIndex={@state.hIndex}
            />
          </div>
        }
      </div>
      <div id="youtube">
        <YouTube
          url={@state.youtubeUrl}
          opts={
            height: 240
            width: 320
            playerVars:
              autoplay: 1
          }
        />
      </div>

    </div>

window.onload = ->
  ReactDOM.render <App />, document.getElementById('content')
