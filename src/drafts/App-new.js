import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

// const ApiBase = 'https://api.github.com'
const RoutesURL = 'https://octokit.github.io/routes/index.json'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: {},
      params: {},
      submitted: false
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
  };

  handleSelectChange(event) {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({[name]: value});
  };

  handleFormChange(paramName, event) {
    const params = this.state.params;
    params[paramName] = event.target.value;
    this.setState({params: params});
  };

  handleSubmit(Path, event) {
    const params = this.state.params;
    const PathParamsArray = Path.match(/:[^/]*/g).map(re => re.replace(':',''));
    const ParamKeys = Object.keys(params);
    let PathParamsObject = {};
    for (let x of PathParamsArray) {
      if (ParamKeys.includes(x)) {
        PathParamsObject[x] = params[x]
        delete params[x]
      }
    }
    for (let [k,v] of Object.entries(PathParamsObject)) {
      Path = Path.replace(':' + k, v)
    }
    this.setState({submitted: true, params: params});
    event.preventDefault();
  }

  componentDidMount () {
    axios.get(RoutesURL)
      .then(response => this.setState({routes: response["data"]}))
  }

  ParamInput(p, index) {
    const params = this.state.params;
    const ParamName = p["p"]["name"] ? p["p"]["name"] : '';
    const ParamValue = params[ParamName] ? params[ParamName] : '';
    return (<td>
      <input
        type="text"
        value={ParamValue}
        onChange={this.handleFormChange.bind(this, ParamName)}
      />
    </td>)
 }

  render() {
    const {routes, catsListSel, namesListSel} = this.state;
    const CatsList = Object.keys(routes);
    const NamesList = catsListSel ? routes[catsListSel] : null;
    const OneCat = namesListSel ? NamesList.find(x => x.name === namesListSel) : null;

    let DocUrl, DocDescription, EnabledGA, Params, Method, Path

    if (OneCat) {
      DocUrl = OneCat["documentationUrl"]
      DocDescription = OneCat["description"] ? <p><b>Description:</b> {OneCat["description"]}</p> : <p/>
      EnabledGA = OneCat["enabledForApps"] ? "Yes" : "No"
      Params = OneCat["params"].length ? OneCat["params"] : null
      Method = <p><b>Method:</b> {OneCat["method"]}</p>
      Path = OneCat["path"]
    }

    return (
      <div className="container">
      <div className="select">
      <p><b>Choose a REST API category:</b></p>
        <select
          name="catsListSel"
          value={catsListSel}
          onChange={this.handleSelectChange}>
            {CatsList.map((cat, index) =>
              <option value={cat} key={index}>{cat}</option>
            )}
        </select>
      </div>
        {NamesList ? (
          <div className="select">
            <p/><p/>
            <p><b>Choose an endpoint:</b></p>
            <select name="namesListSel" value={namesListSel} onChange={this.handleSelectChange}>
            {NamesList.map((n,index) =>
              <option value={n["name"]} key={index}>{n["name"]}</option>
            )}
            </select>
          </div>
              ) : (
          <p/>
        )}
        {OneCat ? (
          <div>
            <p><b>Docs:</b> <a href={DocUrl}>{DocUrl}</a></p>
            <p/><p/>
            <p><b>Enabled for GitHub Apps?</b> {EnabledGA}</p>
            <p/><p/>
            {DocDescription}
            {Method}
          </div>
              ) : (
          <p/>
        )}
        {Params ? (
          <div>
          <p><b>Enter params:</b></p>
            <form onSubmit={this.handleSubmit.bind(this, Path)}>
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
                  {Params.map((p, index) =>
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
              <input className="submit-button" type="submit" value="Submit" />
            </form>
          </div>
            ) : (
          <p/>
        )}
        {this.state.submitted ? (
          <div>
          <p>{JSON.stringify(this.state.params, null, 2)}</p>
          <p>{Path}</p>
          </div>
        ) : (
          <p/>
        )}
       </div>
    );
  }
}
