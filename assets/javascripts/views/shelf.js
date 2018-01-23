import React, { Component } from "react"
import Entry from "./Entry"

export default class Shelf extends Component {
  constructor(props){
    super(props)
    console.log('Shelf constructed')

    this.titleStyle = {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      height: 40,
      marginBottom: 30,
      borderRadius: 20,
      padding: 10
    }

    if(this.props.isFocus){
      this.titleStyle.background = "#AAA"
    }else{
      this.titleStyle.background = "#EEE"
    }
  }

  shouldComponentUpdate(nextProps, nextState){
    if(this.props.category == nextProps.category && this.props.index == nextProps.index){
      return false
    }
    return true
  }

  getElements() {
    // const index = this.props.index//this.props.entries.indexOf(this.props.query)
    const offset = (this.props.rowSize - 1) / 2
    const elements = []

    for(let i = 0; i < this.props.rowSize; i++){
      const index = this.props.index - offset + i
      if(index < 0 || index >= this.props.entries.length){
        // continue
        elements.push(
          <Entry empty={true} />
        )
        continue
      }
      elements.push(
        <Entry
          debugindex={index}
          key={`entry-${i}`}
          title={this.props.entries[index]}
          isFocus={i == offset}
        />
      )
    }
    console.log('entries prepared')

    return elements
  }

  render() {
    console.log("render")

    if(this.props.empty){
      return(
        <div
          className="col-xs-2 emptyshelf"
          style={{height: "80%"}}>
        </div>
      )
    }

    return (
      <div
        className="col-xs-2 shelf"
        style={{height: "80%"}}>
        <div style={this.titleStyle}>
          <span style={{verticalAlign: "middle"}}>{this.props.category}</span>
        </div>
        <div>
          {this.getElements()}
        </div>
      </div>
    )
  }
}
