import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

// const ApiBase = 'https://api.github.com'
const RoutesURL = 'https://octokit.github.io/routes/index.json'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routes: [],
      obj: null
    };
    this.handleChange = this.handleChange.bind(this);
  };

  handleChange(event) {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    })
  };

  getRoutes () {
    axios.get(RoutesURL)
      .then(response => this.setState({routes: response["data"]}))
  };

  getCategories () {
    console.log(this.state.routes)
    let cats = [];
    for(let k in this.state.routes) cats.push(k);
    return cats.map((cat, index) => <option value={cat} key={index}>{cat}</option>)
  };

  getNames (oneCat) {
    return oneCat.map((n,index) => <option value={n["name"]} key={index}>{n["name"]}</option>);
  };

  getDocsUrl (oneCat) {
    let obj = oneCat.find(x => x.name === this.state.namesList);
    this.setState({obj: obj});
    return obj["documentationUrl"];
  }

  getFields (oneCat, obj) {
    return JSON.stringify(obj, null, 2);
  };

  // getParams (oneCat) {
  //   let obj = oneCat.find(x => x.name === this.state.namesList);
  //   return obj["documentationUrl"];
  // }

  componentDidMount() {
    this.getRoutes();
  };

  render() {
    let oneCat = this.state.routes[this.state.catsList];
    let obj = this.state.obj;

    return (
      <div className='container'>
      <p>Choose a REST API category:</p>
        <select name="catsList" value={this.state.catsList} onChange={this.handleChange}>
          {this.getCategories()}
        </select>
        {this.state.catsList ? (
          <div>
            <p/><p/>
            <p>Choose an endpoint:</p>
            <select
              name="namesList"
              value={this.state.namesList}
              onChange={this.handleChange}>
                {this.getNames(oneCat)}
            </select>
          </div>
              ) : (
          <p/>
        )}
          {this.state.namesList ? (
            <div>
              <p><b>Docs:</b> <a href={this.getDocsUrl(oneCat)}>{this.getDocsUrl(oneCat)}</a></p>
              <p/><p/>
              <pre><code>{this.getFields(oneCat, obj)}</code></pre>
            </div>
                ) : (
            <p/>
          )}
       </div>
    );
  }
}
