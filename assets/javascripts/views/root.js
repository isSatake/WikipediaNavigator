import React, { Component } from "react"
import ReactDOM from "react-dom"
import autoBind from 'react-autobind'
import Request from "superagent"

import AppBar from 'material-ui/AppBar'
import LinearProgress from 'material-ui/LinearProgress'
import { cyan500 } from "material-ui/styles/colors"
import RaisedButton from 'material-ui/RaisedButton'
import IconButton from "material-ui/IconButton"
import MenuIcon from "material-ui/svg-icons/navigation/menu"
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up'
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down'
import Dialog from 'material-ui/Dialog'

import Shelf from "./Shelf"
import Search from './Search'
import SettingDrawer from './SettingDrawer'
import { initWikipedia, memberByMember, getRandomPage, searchByTitle } from "../wikipedia"

const COLUMNS_SIZE = 5

export default class Root extends Component {
  constructor(props){
    super(props)

    this.state = {
      query: "",
      entryClusters: [], //{category: String, entries: [String]}
      columns: [],
      currentCategoryIndex: 0,
      currentEntryIndex: 0,
      drawerOpen: false,
      dialogOpen: true,
      wikipediaOpen: false,
      isLoading: false,
      pageToCatDlProgress: 0,
      catToPageDlProgress: 0
    }

    this.rootStyle = {
      display: "flex",
      flexFlow: "column",
      font: "14px 'Lucida Grande', Helvetica, Arial, sans-serif"
    }

  }

  componentDidMount = async () => {
    console.log('root:Wikipediaデータを初期化中だぞ')
    await initWikipedia((progress) => {
      console.log(progress)
      if(progress.type == "pageToCat"){
        this.setState({ pageToCatDlProgress: progress.progress })
        return
      }
      this.setState({ catToPageDlProgress: progress.progress })
    })
    console.log('root:Wikipediaデータの準備ができたぞ')
    this.randomRequest()
    window.addEventListener("keydown", (e) => this.handleKeyDown(e))
  }

  randomRequest = async () => {
    this.setState({
      query: ""
    }, async () => {
      this.requestQuery(true, await getRandomPage())
    })
  }

  requestQuery = async (isJump = false, query = this.currentEntries()[this.state.currentEntryIndex]) => {
    console.log('submit query')
    console.log(query)
    if(!query || query.length == 0 || query == this.state.query){
      return
    }

    if(isJump){
      this.setState({
        query: ""
      })
    }

    this.setState({
      isLoading: true
    })

    const res = await memberByMember(query)
    console.log(res)

    //直前にフォーカスしていたカテゴリにピボットする
    const index = this.state.query == "" ? Math.floor(res.length / 2) : (() => {
      for(let i = 0; i < res.length; i++){
        if(res[i].category == this.state.entryClusters[this.state.currentCategoryIndex].category){
          return i
        }
      }
      return 0
    })()

    console.log(index)

    this.setState({
      currentCategoryIndex: index,
      currentEntryIndex: res[index].entries.indexOf(query),
      query: query,
      entryClusters: res,
      isLoading: false
    }, () => {
      this.refreshColumns()
    })
  }

  currentEntries = () => {
    return this.state.entryClusters[this.state.currentCategoryIndex].entries
  }

  currentCategory = () => {
    return this.state.entryClusters[this.state.currentCategoryIndex].category
  }

  handleKeyDown = (e) => {
    if(e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40 && e.keyCode != 13) {
      return
    }
    e.preventDefault()
    switch (e.keyCode) {
      case 38: //↑
        if (this.state.currentEntryIndex <= 0) {
          return
        }
        this.setState({
          currentEntryIndex: this.state.currentEntryIndex - 1
        }, () => {
          this.refreshColumns()
        })
        return this.requestQuery()
      case 40: //↓
        if (this.state.currentEntryIndex >= this.currentEntries().length - 1) {
          return
        }
        this.setState({
          currentEntryIndex: this.state.currentEntryIndex + 1
        }, () => {
          this.refreshColumns()
        })
        return this.requestQuery()
      case 37: //←
        //currentCategoryIndex
        if (this.state.currentCategoryIndex <= 0) {
          return
        }
        this.setState({
          currentCategoryIndex: this.state.currentCategoryIndex - 1,
          currentEntryIndex: this.state.entryClusters[this.state.currentCategoryIndex - 1].entries.indexOf(this.state.query)
        })
        return this.refreshColumns()
      case 39: //→
        if (this.state.currentCategoryIndex >= this.state.entryClusters.length - 1) {
          return
        }
        this.setState({
          currentCategoryIndex: this.state.currentCategoryIndex + 1,
          currentEntryIndex: this.state.entryClusters[this.state.currentCategoryIndex + 1].entries.indexOf(this.state.query)
        })
        return this.refreshColumns()
      case 13:
        this.toggleWikipedia()
        return
    }
  }

  refreshColumns = () => {
    const offset = (COLUMNS_SIZE - 1) / 2
    const columns = []
    console.log(offset)

    if(this.state.entryClusters.length == 0) {
      return
    }

    for(let i = 0; i < COLUMNS_SIZE; i++){
      const isFocus = i == offset
      const cluster = this.state.entryClusters[this.state.currentCategoryIndex - offset + i]

      if(!cluster){
        columns.push(
          <Shelf
            empty={true}
            rowSize={COLUMNS_SIZE}
          />
        )
        continue
      }

      //currentCategory以外
      const index = isFocus ? this.state.currentEntryIndex : cluster.entries.indexOf(this.state.query)

      columns.push(
        <Shelf
          debugindex={this.state.currentCategoryIndex - offset + i}
          key={`shelf-${i}`}
          rowSize={COLUMNS_SIZE}
          category={cluster ? cluster.category : ""}
          entries={cluster ? cluster.entries : ""}
          isFocus={isFocus}
          index={index}
        />
      )
    }
    console.log('columns updated')
    console.log(columns)

    this.setState({
      columns: columns
    })
    console.log("columns updated")
  }

  toggleDrawer = () => {
    this.setState({
      drawerOpen: !this.state.drawerOpen
    })
  }

  toggleWikipedia = () => {
    this.setState({
      wikipediaOpen: !this.state.wikipediaOpen
    })
  }

  render = () => {
    console.log("render")
    const wikipedia = (
      <iframe
        src={`https://ja.m.wikipedia.org/wiki/${this.state.query}`}
        style={{
          width: "100%",
          height: "90%",
          border: "none"
        }}
      />
    )

    const search = (
      <Search
        searchByTitle={searchByTitle}
        requestQuery={this.requestQuery}/>
    )

    const progress = this.state.isLoading ? <LinearProgress mode="indeterminate" style={{ position: "fixed", top: "64", left: "-1", width: "101%", backgroundColor: "#FFF" }}/> : ""
    const arrow = this.state.wikipediaOpen ? <ArrowDown/> : <ArrowUp/>

    return(
      <div style={this.rootStyle}>
        <AppBar
          title="Wikipedia Navigator"
          titleStyle={{ cursor: "pointer", flex: "0 1 20%" }}
          onLeftIconButtonClick={this.toggleDrawer}
          onTitleClick={this.randomRequest}
          children={search} />
        {progress}
        <div style={{ width: 1155, padding: "10 0 0 20", display: "flex" }}>
          {this.state.columns}
        </div>
        <div style={{ position: "fixed", height: "100%", width: "100%", left: 0, top: this.state.wikipediaOpen ? 65 : "57%", transition: "all 300ms 0s ease", boxShadow: "0px 10px 10px 10px grey"}}>
          {wikipedia}
        </div>
        <FloatingActionButton
        onClick={this.toggleWikipedia}
        style={{ right: 20, bottom: 20, position: "fixed", zIndex: 10 }}>
        {arrow}
        </FloatingActionButton>
        <SettingDrawer
          open={this.state.drawerOpen} />
        <Dialog
          title="Wikipediaデータを準備中"
          open={this.state.dialogOpen} >
          pageToCat
          <LinearProgress
            mode="determinate"
            value={this.state.pageToCatDlProgress} />
          catToPage
          <LinearProgress
            mode="determinate"
            value={this.state.catToPageDlProgress} />
        </Dialog>
      </div>
    )
  }
}


window.onload = () => {
  ReactDOM.render(<Root />, document.getElementById("container"))
}
