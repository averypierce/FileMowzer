import React, { Component } from "react";
import jwt_decode from 'jwt-decode';
import {
    Route,
    NavLink,
    HashRouter
  } from "react-router-dom";
import Home from "./Home";
import Media from "./Media";
import Login from "./Login";

function deleteToken() {
    console.log("what");
    localStorage.removeItem('id_token');
}

function MyWidget(props) {
    let token = localStorage.getItem('id_token');
    if(token != null){
        let decoded = jwt_decode(token);
        return (
            <li class="nav-item dropdown">
        <a class="nav-link" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <i className = "material-icons">account_box</i> {decoded.identity}
        </a>
        <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
          <a class="dropdown-item" >Action</a>
          <a class="dropdown-item" >Another action</a>
          <div class="dropdown-divider"></div>
          <a class="dropdown-item" href="#/Login" onClick={() => deleteToken()}>Sign Out</a>
        </div>
      </li> 
        )
    }
    return (
        <li className="nav-item">                      
            <NavLink to="/Login">
                <div className="nav-link" href="#/Login">Login</div>
            </NavLink>
        </li>  
    )
}

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
                                <MyWidget></MyWidget>     
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