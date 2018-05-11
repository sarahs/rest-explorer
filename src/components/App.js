import React, { Component } from 'react'
import TokenEntry from './TokenEntry'
import Picker from './Picker'
import Results from './Results'
import EndpointInfo from './EndpointInfo'
import ParamsForm from './ParamsForm'
import getTypeOfParams from '../utility/getTypeOfParams'
import generateQueryStringParams from '../utility/generateQueryStringParams'
import generatePath from '../utility/generatePath'
import generateBodyParams from '../utility/generateBodyParams'
import isComplete from '../utility/isComplete'
import isValid from '../utility/isValid'
import runRequest from '../utility/runRequest'
import axios from 'axios'
import '../assets/App.css'

const RoutesURL = 'https://octokit.github.io/routes/index.json'

class App extends Component {
  constructor(props) {
    super(props)

    let storedToken = ''
    let hasStoredToken = false

    if (localStorage.getItem('token')) {
      storedToken = localStorage.getItem('token')
      hasStoredToken = true
    }

    this.state = {
      token: storedToken,
      hasEnteredToken: hasStoredToken,
      tokenEditShow: false,
      routes: {},
      categoriesListSel: '',
      namesListSel: '',
      enteredPathParams: {},
      enteredBodyParams: {},
      copySuccess: '',
      submitted: false
    }
    this.inputElement = React.createRef();
    this.copyElement = React.createRef();
    this.toggleTokenEdit = this.toggleTokenEdit.bind(this);
    this.handleTokenSubmit = this.handleTokenSubmit.bind(this);
    this.handleTokenChange = this.handleTokenChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePathFormChange = this.handlePathFormChange.bind(this);
    this.handleBodyFormChange = this.handleBodyFormChange.bind(this);
    this.copyToClipboard = this.copyToClipboard.bind(this);
    this.clearCopySelection = this.clearCopySelection.bind(this);
    this.escapeNewLines = this.escapeNewLines.bind(this);
    this.handleClearPath = this.handleClearPath.bind(this);
    this.handleClearBody = this.handleClearBody.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearResponse = this.clearResponse.bind(this);
    this.resetResults = this.resetResults.bind(this);
  }

  componentDidMount() {
    axios.get(RoutesURL)
      .then(response => this.setState({
        routes: response["data"]
      })
    )
    document.addEventListener('mousedown', this.clearCopySelection);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.clearCopySelection);
  }

  toggleTokenEdit() {
    this.state.tokenEditShow
      ? this.setState({tokenEditShow: false})
      : this.setState({tokenEditShow: true})
  }

  handleTokenChange(e) {
    this.setState({
      token: e.target.value
    })
  }

  handleTokenSubmit(e) {
    e.preventDefault()
    this.setState({
      hasEnteredToken: true,
      tokenEditShow: false
    })
    localStorage.setItem('token', this.state.token)
  }

  handleSelectChange(selectedOption, name) {
    const value = (selectedOption && selectedOption.value) || ''
    this.setState({
      [name]: value,
      enteredPathParams: {},
      enteredBodyParams: {}
    })
    this.clearCopySelection()
    this.clearResponse()
  }

  handleClearPath() {
    this.setState({
      enteredPathParams: {}
    })
    this.clearCopySelection()
    this.clearResponse()
  }

  handleClearBody() {
    this.setState({
      enteredBodyParams: {}
    })
    this.clearCopySelection()
    this.clearResponse()
  }

  handlePathFormChange(e) {
    const enteredPathParams = this.state.enteredPathParams
    enteredPathParams[e.target.name] = e.target.value
    this.setState({
      enteredPathParams: enteredPathParams
    })
  }

  handleBodyFormChange(e) {
    const enteredBodyParams = this.state.enteredBodyParams
    enteredBodyParams[e.target.name] = e.target.value
    this.setState({
      enteredBodyParams: enteredBodyParams
    })
  }

  escapeNewLines = (text) => {
     return text.replace(/\n/g, " \\\n")
  }

  copyToClipboard = (e) => {
    // let copyText, copyPre, range, selection
    let range, selection
    // copyPre = document.createElement("pre")
    // document.body.appendChild(copyPre)
    // copyText = this.escapeNewLines(this.copyElement.current.innerText)
    // console.log(copyText)
    // copyText = copyText.replace(/\n/g, " \\ \n")
    // copyPre.innerHTML = copyText
    // console.log(copyPre)
    if (window.getSelection) {
      selection = window.getSelection()
      range = document.createRange()
      range.selectNode(this.copyElement.current)
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('copy')
      this.setState({ copySuccess: ' Copied!' })
    }
    e.stopPropagation()
  }

  clearCopySelection() {
    const sel = window.getSelection ? window.getSelection() : document.selection;
    if (sel) {
      if (sel.removeAllRanges) {
        sel.removeAllRanges();
        this.setState({ copySuccess: '' })
      } else if (sel.empty) {
        sel.empty();
        this.setState({ copySuccess: '' })
      }
    }
  }

  clearResponse() {
    this.setState({
      submitted: false
    })
  }

  handleSubmit(e) {
    this.setState({
      submitted: true
    })
    e.preventDefault()
  }

  resetResults() {
    this.setState({
      categoriesListSel: '',
      namesListSel: '',
      enteredPathParams: {},
      enteredBodyParams: {}
    })
    this.clearResponse()
  }

  render() {
    const {routes, categoriesListSel, namesListSel} = this.state
    const categoriesList = Object.keys(routes)
    const firstCategory = categoriesList.length > 0 && categoriesList[0]
    const selectedCategory = categoriesListSel && routes[categoriesListSel]
    const namesList = categoriesListSel && selectedCategory.map(n => n["name"])
    const selectedEndpoint = namesListSel && selectedCategory && selectedCategory.find(x => x.name === namesListSel)
    const method = selectedEndpoint && selectedEndpoint["method"]
    const paramsList = selectedEndpoint ? selectedEndpoint["params"].length > 0 && selectedEndpoint["params"] : null
    const path = selectedEndpoint ? selectedEndpoint["path"] : ""
    const pathArray = path && path.split('/')
    const pathParamsArray = paramsList ? getTypeOfParams(path, paramsList)[0] : {}
    const bodyParamsArray = paramsList ? getTypeOfParams(path, paramsList)[1] : {}
    const apiBase = "https://api.github.com"
    let docslink = categoriesListSel.length > 0 ? categoriesListSel : firstCategory
    docslink = docslink && docslink.split(/(?=[A-Z])/).join('_').toLowerCase()
    docslink = selectedEndpoint ? selectedEndpoint["documentationUrl"] : "https://developer.github.com/v3/" + docslink
    const endpointName = selectedEndpoint && <a href={docslink}>{selectedEndpoint.name}</a>
    const isPathValid = isValid(pathParamsArray, this.state.enteredPathParams)[0]
    const isPathComplete = method ? isComplete(pathParamsArray, this.state.enteredPathParams, "path") && isPathValid : "ignore"
    const invalidCharsEntered = isValid(pathParamsArray, this.state.enteredPathParams)[1]
    const isBodyComplete = (method === "GET" || method === "DELETE" || !method) ? "ignore" : isComplete(bodyParamsArray, this.state.enteredBodyParams, "body")
    const isCodeRunnable = isPathComplete === true && isPathValid === true && isBodyComplete !== false

    const SubmittedQueryStringParams = generateQueryStringParams(method, this.state.enteredBodyParams)
    const SubmittedPath = generatePath(this.state.enteredPathParams, apiBase, this.inputElement, SubmittedQueryStringParams, path)
    const SubmittedBodyParams = generateBodyParams(method, this.state.enteredBodyParams)

    return (
      <div className="container">
        <div className="top-container">
          <TokenEntry
            hasEnteredToken={this.state.hasEnteredToken}
            tokenEditShow={this.state.tokenEditShow}
            toggleTokenEdit={this.toggleTokenEdit}
            onSubmit={this.handleTokenSubmit}
            onChange={this.handleTokenChange}
            value={this.state.token}
          />
          <div className="results-container">
            <Results
              hasEnteredToken={this.state.hasEnteredToken}
              categoriesListSel={this.state.categoriesListSel}
              method={method}
              endpointName={endpointName}
              SubmittedPath={SubmittedPath}
              SubmittedBodyParams={SubmittedBodyParams}
              copyRef={this.copyElement}
              copySuccess={this.state.copySuccess}
              onCopy={this.copyToClipboard}
            />
            {!isPathValid
              ? (<div className="path-not-complete">Invalid characters entered: {invalidCharsEntered}</div>)
              : (null)
            }
            {isCodeRunnable && this.state.hasEnteredToken
              ? (<div className="run-button"><input type="button" value="Run!" onClick={e => this.handleSubmit(e)} /></div>)
              : (null)
            }
            {this.state.hasEnteredToken
              ? (<div className="reset-button"><input type="button" value="Reset" onClick={e => this.resetResults(e)} /></div>)
              : (null)
            }
          </div>
        </div>
        <div className="horizontal-gutter"/>
        <div className="bottom-container">
          <div className="left-panel">
            <Picker
              name="categoriesListSel"
              value={categoriesListSel}
              onChange={this.handleSelectChange}
              options={categoriesList}
              docslink={docslink}
            />
          {categoriesListSel
            ? (<Picker
                name="namesListSel"
                value={namesListSel}
                onChange={this.handleSelectChange}
                options={namesList}
                docslink={docslink}
              />)
            : ( null )
          }
          {selectedEndpoint && selectedEndpoint["description"].length > 0
            ? (<EndpointInfo
                 description={selectedEndpoint["description"]}
              />)
            : ( null )
          }
          {paramsList
            ? (<ParamsForm
                 pathArray={pathArray}
                 pathParamsArray={pathParamsArray}
                 bodyParamsArray={bodyParamsArray}
                 apiBase={apiBase}
                 method={method}
                 onPathChange={this.handlePathFormChange}
                 onBodyChange={this.handleBodyFormChange}
                 onClearPath={this.handleClearPath}
                 onClearBody={this.handleClearBody}
                 enteredPathParams={this.state.enteredPathParams}
                 enteredBodyParams={this.state.enteredBodyParams}
                 inputRef={this.inputElement}
                 isPathComplete={isPathComplete}
                 isBodyComplete={isBodyComplete}
              />)
            : ( null )
          }
          </div>
          <div className="vertical-gutter"/>
          <div className="right-panel">
            <h2>Response</h2>
            <div className="response">
              <pre>{this.state.submitted
                  	 ? runRequest(method, SubmittedPath, this.state.enteredBodyParams, apiBase, this.state.token)
                  	  : "{}"
                    }
              </pre>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
