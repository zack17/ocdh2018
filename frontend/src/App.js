import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import { ObjectView } from "./ObjectView";

class App extends Component {
  render() {
    return (
      <div className="App mt-4 mb-4 mr-4 ml-4">
        <Route path="/" exact component={ObjectView} />
        <Route path="/objects/:objectId" exact component={ObjectView} />
      </div>
    );
  }
}

export default App;
