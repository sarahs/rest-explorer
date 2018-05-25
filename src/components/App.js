import React, { Component } from 'react'
import TokenEntry from './TokenEntry'
import UserInfo from './UserInfo'
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
import apiClient from '../utility/apiClient'
import axios from 'axios'
import '../assets/App.css'

const RoutesURL = 'https://octokit.github.io/routes/index.json'

const apiBase = 'https://api.github.com'

class App extends Component {
  constructor(props) {
    super(props)

    let storedToken = ''
    let hasStoredToken = false
    let userInfoShowStored = false

    if (localStorage.getItem('token')) {
      storedToken = localStorage.getItem('token')
      hasStoredToken = true
    }

    if (localStorage.getItem('userInfoShow') === 'false') {
      userInfoShowStored = true
    }

    this.state = {
      token: storedToken,
      hasEnteredToken: hasStoredToken,
      tokenEditShow: false,
      userInfoShow: userInfoShowStored,
      userName: '',
      rateLimitRemaining: '',
      rateLimit: '',
      routes: {},
      categoriesListSel: '',
      namesListSel: '',
      includeHeaders: true,
      includeStatus: true,
      enteredPathParams: {},
      enteredBodyParams: {},
      copyType: 'results',
      copySuccess: '',
      submitted: false,
      response: '',
      error: '{}'
    }
    this.inputElement = React.createRef();
    this.copyElement = React.createRef();
    this.toggleTokenEdit = this.toggleTokenEdit.bind(this);
    this.toggleUserInfo = this.toggleUserInfo.bind(this);
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
    this.toggleHeaders = this.toggleHeaders.bind(this);
    this.toggleStatus = this.toggleStatus.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.runRequest = this.runRequest.bind(this);
    this.clearResponse = this.clearResponse.bind(this);
    this.resetResults = this.resetResults.bind(this);
    this.handleSuccessResponse = this.handleSuccessResponse.bind(this);
    this.handleErrorResponse = this.handleErrorResponse.bind(this);
  }

  componentDidMount() {
    axios.get(RoutesURL)
      .then(response => this.setState({
        routes: response["data"]
      })
    )
    document.addEventListener('mousedown', this.clearCopySelection)
    if (this.state.hasEnteredToken) {
      this.runRequest('GET', 'https://api.github.com/user', {})
    }
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.clearCopySelection)
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
    this.state.token === ''
      ? this.setState({hasEnteredToken: false})
      : this.setState({hasEnteredToken: true})
    this.setState({
      tokenEditShow: false,
      token: this.state.token
    })
    localStorage.setItem('token', this.state.token)
  }

  toggleUserInfo() {
    this.state.userInfoShow
      ? this.setState({userInfoShow: false})
      : this.setState({userInfoShow: true})
    localStorage.setItem('userInfoShow', this.state.userInfoShow)
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

  copyToClipboard = (e, type) => {
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
      if (type === 'results') {
        if (this.copyElement.current) {
          range.selectNode(this.copyElement.current)
        }
        else {
          range.selectNode(document.getElementsByTagName("pre").item(0))
        }
      }
      else {
        range.selectNode(document.getElementsByClassName(type)[0].children[1])
      }
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('copy')
      this.setState({
        copyType: type,
        copySuccess: ' Copied!'
      })
    }
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

  toggleHeaders() {
    this.state.includeHeaders
      ? this.setState({includeHeaders: false})
      : this.setState({includeHeaders: true})
  }

  toggleStatus() {
    this.state.includeStatus
      ? this.setState({includeStatus: false})
      : this.setState({includeStatus: true})
  }

  handleSubmit(e, method, submittedPath, submittedBody) {
    this.setState({
      submitted: true
    })
    this.runRequest(method, submittedPath, submittedBody)
    e.preventDefault()
  }

  resetResults() {
    this.setState({
      categoriesListSel: '',
      namesListSel: '',
      enteredPathParams: {},
      enteredBodyParams: {},
      response: '',
      error: '{}'
    })
    this.clearResponse()
  }

  runRequest(method, submittedPath, submittedBody) {
    const request = apiClient(apiBase, this.state.token)

    switch(method) {
      case 'GET':
        request.get(submittedPath)
          .then(response => this.handleSuccessResponse(response, submittedPath))
          .catch(error => this.handleErrorResponse(error))
        break
      case 'POST':
        request.post(submittedPath, submittedBody)
          .then(response => this.handleSuccessResponse(response))
          .catch(error => this.handleErrorResponse(error))
        break
      case 'PUT':
        request.put(submittedPath, submittedBody)
          .then(response => this.handleSuccessResponse(response))
          .catch(error => this.handleErrorResponse(error))
        break
      case 'PATCH':
        request.patch(submittedPath, submittedBody)
          .then(response => this.handleSuccessResponse(response))
          .catch(error => this.handleErrorResponse(error))
        break
      case 'DELETE':
        request.delete(submittedPath)
          .then(response => this.handleSuccessResponse(response))
          .catch(error => this.handleErrorResponse(error))
        break
      default:
        return "Invalid method!"
      }
  }

  handleSuccessResponse(response, submittedPath) {
    if (submittedPath === "https://api.github.com/user") {
      this.setState({
        rateLimitRemaining: response.headers["x-ratelimit-remaining"],
        rateLimit: response.headers["x-ratelimit-limit"],
        userName: response.data.login
      })
    }
    if (this.state.submitted) {
      this.setState({response: response})
    }
  }

  handleErrorResponse(error) {
    this.setState({error: error})
  }

  render() {
    const {routes, categoriesListSel, namesListSel} = this.state
    const categoriesList = Object.keys(routes)
    const selectedCategory = categoriesListSel && routes[categoriesListSel]
    const namesList = categoriesListSel && selectedCategory.map(n => n["name"])
    const selectedEndpoint = namesListSel && selectedCategory && selectedCategory.find(x => x.name === namesListSel)
    const method = selectedEndpoint && selectedEndpoint["method"]
    const paramsList = selectedEndpoint ? selectedEndpoint["params"].length > 0 && selectedEndpoint["params"] : null
    const path = selectedEndpoint ? selectedEndpoint["path"] : ""
    const pathArray = path && path.split('/')
    const pathParamsArray = paramsList ? getTypeOfParams(path, paramsList)[0] : {}
    const bodyParamsArray = paramsList ? getTypeOfParams(path, paramsList)[1] : {}
    let docslink = categoriesListSel.length > 0 ? categoriesListSel : null
    docslink = docslink && docslink.split(/(?=[A-Z])/).join('_').toLowerCase()
    const docslinkCategory = docslink && "https://developer.github.com/v3/" + docslink
    const docslinkEndpoint = selectedEndpoint ? selectedEndpoint["documentationUrl"] : null
    const endpointName = selectedEndpoint && docslink ? <a href={docslink}>{selectedEndpoint.name}</a> : null
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
          <nav className="top-bar">
            <TokenEntry
              hasEnteredToken={this.state.hasEnteredToken}
              tokenEditShow={this.state.tokenEditShow}
              toggleTokenEdit={this.toggleTokenEdit}
              onSubmit={this.handleTokenSubmit}
              onChange={this.handleTokenChange}
              value={this.state.token}
            />
            <UserInfo
              hasEnteredToken={this.state.hasEnteredToken}
              userInfoShow={this.state.userInfoShow}
              toggleUserInfo={this.toggleUserInfo}
              userName={this.state.userName}
              rateLimit={this.state.rateLimit}
              rateLimitRemaining={this.state.rateLimitRemaining}
            />
          </nav>
          <div className="results-container">
            <Results
              hasEnteredToken={this.state.hasEnteredToken}
              categoriesListSel={this.state.categoriesListSel}
              includeHeaders={this.state.includeHeaders}
              method={method}
              endpointName={endpointName}
              SubmittedPath={SubmittedPath}
              SubmittedBodyParams={SubmittedBodyParams}
              copyRef={this.copyElement}
              copySuccess={this.state.copySuccess}
              copyType={this.state.copyType}
              onCopy={this.copyToClipboard}
            />
            <div className="button-row">
              {isCodeRunnable && this.state.hasEnteredToken
                ? (<div className="run-button"><input type="button" value="Run!" onClick={e => this.handleSubmit(e, method, SubmittedPath, this.state.enteredBodyParams)} /></div>)
                : (null)
              }
              {this.state.hasEnteredToken
                ? (<div className="reset-button"><input type="button" value="Reset" onClick={e => this.resetResults(e)} /></div>)
                : (null)
              }
              {!isPathValid
                ? (<div className="path-not-complete">Invalid characters entered: "{invalidCharsEntered}"</div>)
                : (null)
              }
              <label className="include-status"><input name="includeStatus" type="checkbox" checked={this.state.includeStatus} onChange={this.toggleStatus} /> Include status</label>
              <label className="include-headers"><input name="includeHeaders" type="checkbox" checked={this.state.includeHeaders} onChange={this.toggleHeaders} /> Include headers</label>
            </div>
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
              docslink={docslinkCategory}
            />
          {categoriesListSel
            ? (<Picker
                name="namesListSel"
                value={namesListSel}
                onChange={this.handleSelectChange}
                options={namesList}
                docslink={docslinkEndpoint}
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
              {this.state.response && this.state.includeStatus
                ? <div className="status">
                    <div className="status-buttons">
                      <p>Status:</p>
                      <span className="copy-span"><button onClick={e => this.copyToClipboard(e, "status")}>Copy</button>{this.state.copyType === "status" ? this.state.copySuccess : null}</span>
                    </div>
                    <pre>{this.state.response.status + ' ' + this.state.response.statusText}</pre>
                  </div>
                : null
              }
              {this.state.response && this.state.includeHeaders
                ? <div className="headers">
                    <div className="headers-buttons">
                      <p>Headers:</p>
                      <span className="copy-span"><button onClick={e => this.copyToClipboard(e, "headers")}>Copy</button>{this.state.copyType === "headers" ? this.state.copySuccess : null}</span>
                    </div>
                    <pre>{JSON.stringify(this.state.response.headers, null, 2)}</pre>
                  </div>
                : null
              }
              {this.state.response
                ? <div className="data">
                    <div className="data-buttons">
                      <p>Response:</p>
                      <span className="copy-span"><button onClick={e => this.copyToClipboard(e, "data")}>Copy</button>{this.state.copyType === "data" ? this.state.copySuccess : null}</span>
                    </div>
                    <pre>{JSON.stringify(this.state.response.data, null, 2)}</pre>
                  </div>
                : <div className="data"><pre>{this.state.error === '{}' ? this.state.error : JSON.stringify(this.state.error, null, 2)}</pre></div>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
