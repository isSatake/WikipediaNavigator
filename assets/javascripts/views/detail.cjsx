'use strict'

React = require 'react'

module.exports = Shelf = React.createClass

  render: ->
    entry = @props.entry
    return <div /> if not entry
    <div className="col-xs-12">
      <h3>
        &nbsp; {entry.title} &nbsp;
        <a target="_blank" href={entry.permalink}>
          <span className="glyphicon glyphicon-book" onClick={@props.onClickEntry.bind(null, entry)}/>
        </a>
      </h3>
      <hr />
      <div>
        {entry.description}
      </div>
    </div>


