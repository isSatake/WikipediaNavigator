import React, { Component } from "react"
import Drawer from "material-ui/Drawer"
import AppBar from 'material-ui/AppBar'
import MenuItem from "material-ui/MenuItem"
import StorageIcon from "material-ui/svg-icons/device/storage"

export default class SettingDrawer extends Component {
  constructor(props){
    super(props)

    this.state = {
      open: false
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.open == nextProps.open){
      return
    }
    this.setState({
      open: nextProps
    })
  }

  toggleDrawer = () => {
    this.setState({
      open: !this.state.open
    })
  }

  toggleDbDialog = (e) => {
  }

  render = () => {
    // const menus = [
    //   <MenuItem
    //     leftIcon={<StorageIcon />}
    //     onClick={this.toggleDbDialog}>
    //     設定
    //   </MenuItem>
    // ]
    const menus = []

    return(
      <Drawer
        open={this.state.open}
        docked={false}
        onRequestChange={(open) => this.setState({open})}
        width={330} >
        <AppBar
          title="Wikipedia Navigator"
          onLeftIconButtonClick={this.toggleDrawer} />
        {menus}
      </Drawer>
    )
  }
}
