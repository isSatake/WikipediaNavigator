'use strict'

React  = require 'react'

module.exports = Shelf = React.createClass

  shelfStyle: ->
    if @props.isActive
      background: 'wheat'
      padding: 10
    else
      padding: 10

  entryStyle: (index, entry)->
    if @props.hIndex is index and @props.isActive
      background: 'darkseagreen'
      fontWeight: 'bold'
      height: 40
    else if @props.query is entry
      background: 'wheat'
      height: 40
    else
      height: 40


  render: ->
    if @props.entries.length > 0
      <div style={@shelfStyle()} >
          {@props.entries.map (entry, index)=>
            <p style={@entryStyle(index, entry)}>{entry}</p>
          }
      </div>
    else
      <p>候補なし</p>

