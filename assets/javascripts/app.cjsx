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

    # popstate
    ReactDOM
    .findDOMNode(@)
    .offsetParent
    .addEventListener 'popstate', (query)=>
      console.log "popstate #{query}"
      @openQuery(query)

    # keyboard
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
          return if @state.hIndex >= @currentEntries()[1].length
          @setState
            hIndex: @state.hIndex+1
          @waitForSelect()
        when 37 # left
          return if @state.vIndex <= 0
          @setState
            vIndex: @state.vIndex-1
          @waitForSelect()
        when 39 # right
          return if @state.vIndex >= @state.entryClusters.length-1
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
    , 1000 # 1.5 sec

  ### Network ###
  updateQuery: (query)->
    return if _.isEmpty query
    return if query is @state.query
    @setState query: query, ->
      history.pushState query, null, "/#{query}"
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

        existIndex = res.body[index][1].indexOf(@state.query)
        if existIndex isnt -1
          res.body[index][1].splice(existIndex, 1)
        res.body[index][1].splice(@state.hIndex, 0, @state.query)
        result.push res.body[index]
      # if result cluster length is short
      if res.body.length <= @state.vIndex
        result.push @currentEntries()
        @setState vIndex: result.length-1

      @setState entryClusters: result

  # find query and open youtube
  openQuery: (query)->
    query ||= @currentEntries()[1][@state.hIndex]
    return if query is @state.query
    @updateQuery(query)
    request "/getmusic/#{query}"
    .end (err, res)=>
      @setState
        youtubeUrl: "http://www.youtube.com/watch?v=#{res.text}"

  ### Styles and Markups ###
  render: ->
    <div className="container-fluid">
      <div className="row">
        <h4>{@state.query} &nbsp;
          <small> youtube: {@state.youtubeUrl}</small>
        </h4>

        {@state.entryClusters.map (cluster, index)=>
          <div className="col-xs-2">
            <h5 style={
              height: 30
              textDecoration: 'underline'
            }>{cluster[0].replace('Category:','')}</h5>
            <Shelf
              entries={cluster[1]}
              isActive={@state.vIndex is index}
              hIndex={@state.hIndex}
              query={@state.query}
            />
          </div>
        }
      </div>
      <div id="youtube">
        <YouTube
          url={@state.youtubeUrl}
          opts={
            height: 90
            width: 160
            playerVars:
              autoplay: 1
          }
          onReady={(e)-> e.target.playVideo() }
          onError={(e)-> console.error e }
        />
      </div>

    </div>

window.onload = ->
  ReactDOM.render <App />, document.getElementById('content')
