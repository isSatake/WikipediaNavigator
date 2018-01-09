import React, { Component } from "react"
import ReactDOM from 'react-dom'
import Request from "superagent"
import Shelf from "./views/shelf"

const COLUMNS_SIZE = 4

class App extends Component {
  constructor(props){
    super(props)

    this.nowWaiting = false

    console.log("init")
    this.state = {
      query: "",
      entryClusters: [],
      vIndex: 0,
      hIndex: 0
    }
  }

  componentDidMount() {
    this.updateQuery(decodeURI(location.pathname.replace("/", "")))
    window.addEventListener("keydown", ::this.handleKeyDown)
  }

  currentEntries() {
    return this.state.entryClusters[this.state.vIndex]
  }

  currentCategory() {
    return !(this.state.entryClusters.length > 0) ? "" : this.state.entryClusters[this.state.vIndex][0]
  }

  waitForSelect() {
    if (this.nowWaiting) {
      return
    }
    this.nowWaiting = true
    return setTimeout(() => {
      this.openQuery()
      this.nowWaiting = false
    }, 1000)
  }

  updateQuery(query) {
    if(!query || query.length == 0 || query == this.state.query){
      return
    }

    this.setState({
      query: query
    }, () => {
      history.pushState(query, null, "/" + query)
    })

    Request
      .get(`/memberbymember/${query}`)
      .then(res => {
        console.log(res.body)
        const result = []
        for(let index in res.body){
          const label = res.body[index][0]
          if(index == this.state.vIndex && this.state.entryClusters.length > 0){
            result.push(this.currentEntries())
          }
          if(index >= COLUMNS_SIZE || label == this.currentCategory()){
            continue
          }

          //queryと同じ名前のエントリを同じ列に並べる
          const existIndex = res.body[index][1].indexOf(this.state.query)
          if(existIndex != -1){
            res.body[index][1].splice(existIndex, 1)
          }
          res.body[index][1].splice(this.state.hIndex, 0, this.state.query)
          result.push(res.body[index])
        }

        if(res.body.length <= this.state.vIndex){
          result.push(this.currentEntries())
          this.setState({
            vIndex: result.length - 1
          })
        }

        console.log(`res.length: ${res.body.length}  result.length: ${result.length}`)
        this.setState({
          entryClusters: result
        })
      })
      .catch(err => console.error)
  }

  openQuery(query = this.currentEntries()[1][this.state.hIndex]) {
    this.updateQuery(query)
  }

  handleKeyDown(e) {
    e.preventDefault()
    switch (e.keyCode) {
      case 38: //↑
        if (this.state.hIndex <= 0) {
          return
        }
        this.setState({
          hIndex: this.state.hIndex - 1
        })
        return this.waitForSelect()
      case 40: //↓
        if (this.state.hIndex >= this.currentEntries()[1].length) {
          return
        }
        this.setState({
          hIndex: this.state.hIndex + 1
        })
        return this.waitForSelect()
      case 37: //←
        //vIndex
        if (this.state.vIndex <= 0) {
          return
        }
        this.setState({
          vIndex: this.state.vIndex - 1
        })
        return this.waitForSelect()
      case 39: //→
        if (this.state.vIndex >= this.state.entryClusters.length - 1) {
          return
        }
        this.setState({
          vIndex: this.state.vIndex + 1
        })
        return this.waitForSelect()
    }
  }

  render() {
    console.log(this.state)
    const col = []
    let iframe

    for(let index in this.state.entryClusters){
      const cluster  = this.state.entryClusters[index]
      col.push(
        <div className="col-xs-2">
          <h5 style={{
            height: 30,
            textDecoration: "underline"
          }}>
            {cluster[0].replace("Category:", "")}
          </h5>
          <Shelf
            entries={cluster[1]}
            isActive={this.state.vIndex == index}
            hIndex={this.state.hIndex}
            query={this.state.query}
          />
        </div>
      )
    }

    if(col.length > 0){
      iframe = (
        <iframe
          src={`https://ja.wikipedia.org/wiki/${this.state.query}`}
          width="100%"
          height="100%" />
      )
    }

    return(
      <div
        className="container-fluid"
        style={{ display: "flex" }} >
        <div className="row">
          <h4>{this.state.query}</h4>
          {col}
          <div className="col-xs-4">
            {iframe}
          </div>
        </div>
      </div>
    )
  }
}

window.onload = () => {
  ReactDOM.render(<App />, document.getElementById("container"))
}
