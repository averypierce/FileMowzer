import React, { Component } from "react";
import {
  Route,
  NavLink,
  HashRouter
} from "react-router-dom";
import Home from "./Home";
import Media from "./Media";
import Login from "./Login";
import Nav from "./Nav";

class Main extends Component {
    render() {
      return (
        <div>
          <Nav>
          </Nav>     
        </div>
      );
    }
  }
 
export default Main;