'use strict'

React  = require 'react'

module.exports = Shelf = React.createClass

  shelfStyle: ->
    if @props.isActive
      background: 'wheat'
      padding: 10
    else
      padding: 10

  entryStyle: (index)->
    if @props.hIndex is index and @props.isActive
      background: 'darkseagreen'
      fontWeight: 'bold'


  render: ->
    if @props.entries.length > 0
      <div style={@shelfStyle()} >
          {@props.entries.map (entry, index)=>
            <p style={@entryStyle(index)}>{entry}</p>
          }
      </div>
    else
      <p>候補なし</p>

