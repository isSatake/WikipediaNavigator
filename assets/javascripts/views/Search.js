import React, { Component } from "react"
import Autosuggest from 'react-autosuggest'
import searchTheme from './searchTheme'

export default class Search extends Component {
  constructor(props){
    super(props)
    this.state = {
      value: "",
      suggestions: []
    }
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    })
  }

  onSuggestionsFetchRequested = async (query) => {
    this.setState({
      suggestions: await this.props.searchByTitle(query.value)
    })
  }

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    })
  }

  getSuggestionValue = value => value

  renderSuggestion = suggestion => {
    return(
      <div style={{ zIndex: 100 }}>
       {suggestion}
      </div>
    )
  }

  onSearch = (value) => {}

  onSelected = (event, { suggestion }) => {
    console.log(suggestion)
    console.log(this)
    this.props.requestQuery(true, suggestion)
    //フォーカスを外す
    this.onSuggestionsClearRequested()
    this.autosuggest.input.blur()
  }

  render() {
    const { value, suggestions } = this.state
    const inputProps = {
      placeholder: "Wikipediaページ名を指定",
      value,
      onChange: this.onChange
    }

    return(
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
        onSuggestionSelected={this.onSelected}
        theme={searchTheme}
        ref={this.autosuggest}
      />
    )
  }
}
