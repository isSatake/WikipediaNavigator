import React, { Component } from "react"
import Request from "superagent"

export default class Entry extends Component {
  constructor(props){
    super(props)
    this.state = {
      img: "./images/noimg.png"
    }
    this.style = {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      height: 40,
      marginBottom: 40
    }
    if(this.props.isFocus){
      this.style.background = "#DDD"
    }else{
      this.style.background = "#FFF"
    }

    this.searchImage()
  }

  componentWillReceiveProps(nextProps){
    console.log(nextProps)
    this.setState({img: "./images/noimg.png"})
    this.searchImage(nextProps.title)
  }

  searchImage(title = this.props.title) {
    console.log("search image")
    //キャッシュを保存

    // Request
    //   .get(`https://api.cognitive.microsoft.com/bing/v7.0/images/search?count=1&q=${encodeURIComponent(title)}`)
    //   .set("Ocp-Apim-Subscription-Key", "3ebf24197a5a4366b937f25e14869320")
    //   .then(res => {
    //     // return res.body.value ? res.body.value[0].thumbnailUrl : "./images/noimg.png"
    //     const img = res.body.value ? res.body.value[0].thumbnailUrl : "./images/noimg.png"
    //     this.setState({img: img})
    //   })
  }

  render() {
    console.log("render")

    if(this.props.empty){
      return(
        <div
          className={"emptyentry"}
          style={this.style}></div>
      )
    }

    return(
      <div style={this.style}>
        <img
          src={this.state.img}
          width={30} />
        {this.props.debugindex}: {this.props.title}
      </div>
    )
  }
}
