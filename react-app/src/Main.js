import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Media from "./Media";
import Login from "./Login";

class Main extends Component {
    render() {
      return (
        <HashRouter>
          <div>
            <h1>FileMowzer</h1>
            <ul className="header">
              <li><NavLink exact to="/">Home</NavLink></li>
              <li><NavLink to="/Media">Media</NavLink></li>
              <li><NavLink to="/Login">Login</NavLink></li>
            </ul>
            <div className="content">
              <Route exact path="/" component={Home}/>
              <Route path="/Media" component={Media}/>
              <Route path="/Login" component={Login}/>
            </div>
          </div>
        </HashRouter>
      );
    }
  }
 
export default Main;