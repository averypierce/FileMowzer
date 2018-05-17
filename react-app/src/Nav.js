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
              <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
                <a className="navbar-brand" href="#/">FileMowzer</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">                      
                            <NavLink exact to="/">
                                <div className="nav-link" href="#/">Home</div>
                            </NavLink>
                        </li>
                        <li className="nav-item">                      
                                <NavLink to="/Media">
                                    <div className="nav-link" href="#/Media">Media</div>
                                </NavLink>
                        </li>                       
                    </ul>
                </div>
                <div className="collapse navbar-collapse" id="navbarText">
                    <ul className="navbar-nav ml-auto">
                    <li className="nav-item">                      
                                <NavLink to="/Login">
                                    <div className="nav-link" href="#/Login">Login</div>
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