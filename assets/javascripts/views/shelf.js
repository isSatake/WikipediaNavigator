import React, { Component } from "react"

export default class Shelf extends Component {
  constructor(props){
    super(props)
  }

  shelfStyle() {
    if(this.props.isActive){
      return {
        background: "wheat",
        padding: 10
      }
    }else{
      return {
        padding: 10
      }
    }
  }

  entryStyle(index, entry) {
    if(this.props.hIndex == index && this.props.isActive){
      return {
        background: "darkseagreen",
        fontWeight: "bold",
        height: 40
      }
    }else if(this.props.query === entry){
      return {
        background: "wheat",
        height: 40
      }
    }else{
      return {
        height: 40
      }
    }
  }

  render() {
    if(this.props.entries.length > 0){
      const entry = this.props.entries
      let entries = []
      for(let index in entry){
        entries.push(<p style={this.entryStyle(index, entry[index])}>{entry[index]}</p>)
      }
      return (
        <div style={this.shelfStyle()}>
          {entries}
        </div>
      )
    }else{
      return (
        <p>候補なし</p>
      )
    }
  }
}
