import React, { Component } from "react";
import {
    Route,
    NavLink,
    HashRouter
  } from "react-router-dom";
import Home from "./Home";
import Media from "./Media";
import Login from "./Login";
class Nav extends Component {
    render() {
        return(
            <HashRouter>
              <div>            
              <nav class="navbar navbar-expand-sm navbar-dark bg-dark">
                <a class="navbar-brand" href="#">FileMowzer</a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarText">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item">                      
                            <NavLink exact to="/">
                                <a class="nav-link" href="#/">Home</a>
                            </NavLink>
                        </li>
                        <li class="nav-item">                      
                                <NavLink to="/Media">
                                    <a class="nav-link" href="#/Media">Media</a>
                                </NavLink></li>                       
                        <li class="nav-item">
                            <NavLink to="/Login">
                                <a class="nav-link" href="#/Login">Login</a>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
    
                <div className="content">
                  <Route exact path="/" component={Home}/>
                  <Route path="/Media" component={Media}/>
                  <Route path="/Login" component={Login}/>
                </div>
              </div>

              
            </HashRouter>
        )
    }
}

export default Nav;