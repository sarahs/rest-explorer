import React, { Component } from 'react';
import './App.css';

// const ApiBase = 'https://api.github.com'
const RoutesURL = 'https://octokit.github.io/routes/index.json'

// class CurlResult extends Component {
//   render() {
//     return (
//       <div>
//         <p>{JSON.stringify(this.state.params, null, 2)}</p>
//         <p>{Path}</p>
//       </div>
//     )
//   }
// }
//
// class ParamsRow extends React.Component {
//   render() {
//     return (
//       {this.props.paramsList.map((p, index) =>
//       <tr key={index}>
//         <td><code>{p["name"]}</code></td>
//         <td><code>{p["type"]}</code></td>
//         <td><code>{p["required"].toString()}</code></td>
//         <td>{p["description"]}</td>
//         {this.ParamInput({p}, {index})}
//       </tr>
//     )}
//     )
//   }
// }

class ParamsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      enteredParams: {},
      submitted: false
    }
    this.handleFormChange = this.handleFormChange.bind(this);
  }

  handleFormChange(paramName, event) {
    const enteredParams = this.state.enteredParams;
    enteredParams[paramName] = event.target.value;
    this.setState({enteredParams: enteredParams});
  };

  analyzeParams(path, paramsList) {
    const pathParams = path.match(/:[^/]*/g).map(re => re.replace(':',''));
    let pathParamsArray = [];
    let otherParamsArray = [];
    for (let x of Object.entries(paramsList)) {
      pathParams.includes(x[1]["name"]) ? pathParamsArray.push(x[1]) : otherParamsArray.push(x[1])
    }
    return [pathParamsArray, otherParamsArray];
  }

  ParamInput(p, index) {
    const enteredParams = this.state.enteredParams;
    const paramName = p["p"]["name"] ? p["p"]["name"] : '';
    const paramValue = enteredParams[paramName] ? enteredParams[paramName] : '';
    return (<td>
      <input
        type="text"
        value={paramValue}
        onChange={this.handleFormChange.bind(this, paramName)}
      />
    </td>)
  }

  render() {
    const {path, method, paramsList} = this.props;
    const paramType = {method} === "GET" ? "query string" : "request body"
    const pathParamsArray = this.analyzeParams(path, paramsList)[0]
    const otherParamsArray = this.analyzeParams(path, paramsList)[1]

    return (
      <div>
        <p><b>Path: {path} </b></p>
        <p/><p/>
        {pathParamsArray ?
          (<div>
            <p><b>Enter path parameters:</b></p>
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Required?</th>
                <th>Description</th>
                <th>Enter:</th>
              </tr>
              </thead>
              <tbody>
                  {pathParamsArray.map((p, index) =>
                  <tr key={index}>
                    <td><code>{p["name"]}</code></td>
                    <td><code>{p["type"]}</code></td>
                    <td><code>{p["required"].toString()}</code></td>
                    <td>{p["description"]}</td>
                    {this.ParamInput({p}, {index})}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p/>
        )}
        {otherParamsArray ?
          (<div>
            <p><b>Enter {paramType} parameters:</b></p>
            <table>
              <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Required?</th>
                <th>Description</th>
                <th>Enter:</th>
              </tr>
              </thead>
              <tbody>
                  {otherParamsArray.map((p, index) =>
                  <tr key={index}>
                    <td><code>{p["name"]}</code></td>
                    <td><code>{p["type"]}</code></td>
                    <td><code>{p["required"].toString()}</code></td>
                    <td>{p["description"]}</td>
                    {this.ParamInput({p}, {index})}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <p/>
        )}
      </div>)
  }
}

class CategoryInfo extends Component {
  render() {
    const {oneCat, method} = this.props;
    const docUrl = oneCat["documentationUrl"]
    const description = oneCat["description"].length > 0 ? <p><b>Description:</b> {oneCat["description"]}</p> : <p/>
    const enabledGA = oneCat["enabledForApps"] ? "Yes" : "No"

    return (
      <div>
        <p><b>Docs:</b> <a href={docUrl}>{docUrl}</a></p>
        <p/><p/>
        <p><b>Enabled for GitHub Apps?</b> {enabledGA}</p>
        <p/><p/>
        <p><b>Method:</b> {method} </p>
        {description}
    </div>)
  }
}

class ChooseEndpoint extends Component {
  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(event) {
    this.props.onSelectChange(event)
  };

  render() {
    const {namesList, namesListSel} = this.props;

    return (
      <div className="select">
        <p/><p/>
        <p><b>Choose an endpoint:</b></p>
        <select
          name="namesListSel"
          value={namesListSel}
          onChange={this.handleSelectChange}
        >
          {namesList.map((n,index) =>
            <option value={n["name"]} key={index}>{n["name"]}</option>
          )}
        </select>
    </div>)
  }
}

class ChooseCategory extends Component {
  constructor(props) {
    super(props);
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  handleSelectChange(event) {
    this.props.onSelectChange(event)
  };

  render() {
    const {catsList, catsListSel} = this.props;

    return (
      <div className="select">
        <p><b>Choose a REST API category:</b></p>
        <select
          name="catsListSel"
          value={catsListSel}
          onChange={this.handleSelectChange}
        >
          {catsList.map((cat, index) =>
            <option value={cat} key={index}>{cat}</option>
          )}
        </select>
      </div>
    )
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: {},
      catsListSel: '',
      namesListSel: ''
    }
    this.handleSelectChange = this.handleSelectChange.bind(this);
  }

  componentDidMount () {
    axios.get(RoutesURL)
      .then(response => this.setState({
        routes: response["data"]
      })
    )
  }

  handleSelectChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  };

  render() {
    const {routes, catsListSel, namesListSel} = this.state;
    const catsList = Object.keys(routes);
    const namesList = catsListSel ? routes[catsListSel] : null;
    const oneCat = namesListSel ? namesList.find(x => x.name === namesListSel) : null;
    const paramsList = oneCat ? oneCat["params"].length > 0 ? oneCat["params"] : null : null;
    const path = oneCat ? oneCat["path"] : null;
    const method = oneCat ? oneCat["method"] : null;

    return (
      <div className="container">
        <ChooseCategory
          catsList={catsList}
          onSelectChange={this.handleSelectChange}
        />
        {namesList ? (
          <ChooseEndpoint
            namesList={namesList}
            onSelectChange={this.handleSelectChange}
          />
        ) : (
          <p/>
        )}
        {oneCat ? (
          <CategoryInfo
            oneCat={oneCat}
            method={method}
          />
        ) : (
          <p/>
        )}
        { paramsList ? (
          <ParamsTable
            paramsList={paramsList}
            path={path}
            method={method}
          />
        ) : (
          <p/>
        )}
      </div>
    )
  }
}

// <CurlResult/>
