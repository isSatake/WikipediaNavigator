import React, {Component} from "react"
import * as axios from "axios"

const ENTRY_SIZE = 40

export default class Entry extends Component {
  constructor(props) {
    super(props)

    this.state = {
      img: ""
    }

    this.style = {
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      width: "100%",
      height: ENTRY_SIZE,
      marginBottom: 20,
      paddingLeft: 10,
      borderRadius: "20px",
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box"
    }

    if (this.props.empty) {
      this.style.background = "#FFF"
    } else if (this.props.isFocus) {
      this.style.background = "#AAA"
      this.style.fontWeight = "bold"
    } else {
      this.style.background = "#EEE"
    }

    this.imgStyle = {
      width: ENTRY_SIZE,
      height: ENTRY_SIZE,
      objectFit: "cover",
      marginRight: "10px",
      borderRadius: "20px"
    }

    //this.setImage()
  }

  componentWillReceiveProps = async (nextProps) => {
    console.log(nextProps)
    if (this.props.title === nextProps.title) {
      return
    }

    //this.setImage()
  }

  setImage = async () => {
    this.setState({img: ""})
    console.log((`get /image/${this.props.title}`))
    const res = await axios.get(`/image/${this.props.title}`).catch(() => null)
    this.setState({img: !res ? "" : res.data}, () => {
      console.log(`setImage: ${this.state.img}`)
    })
  }

  render = () => {
    console.log("render")

    if (this.props.empty) {
      return (
          <div style={this.style}/>
      )
    }

    const img = ""

    // const img = (
    //     <img
    //         src={this.state.img}
    //         style={this.imgStyle}/>
    // )

    return (
        <div style={this.style}>
          {img}
          <div>{this.props.title}</div>
        </div>
    )
  }
}
