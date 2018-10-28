import React, { Component } from "react";
import { Route } from "react-router-dom";
import "./App.css";
import { ObjectView } from "./ObjectView";
import Link from "react-router-dom/Link";

class App extends Component {
  render() {
    return (
      <div className="App container">
        <nav className="navbar navbar-dark bg-dark">
          <Link className="navbar-brand" to="/">
            Artify
          </Link>
        </nav>
        <main className=" mt-4 mb-4" style={{ minHeight: "420px" }}>
          <Route path="/" exact component={ObjectView} />
          <Route path="/objects/:objectId" exact component={ObjectView} />
        </main>
        <footer>
          <small className="text-muted">
            Artify is a Project created at the 4th Swiss Open Cultural Data
            Hackathon in Zurich 2018
          </small>
        </footer>
      </div>
    );
  }
}

export default App;
