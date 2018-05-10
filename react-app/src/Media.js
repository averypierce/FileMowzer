import React, { Component } from "react";
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BreadCrumb from "./BreadCrumb";
import FolderView from "./FolderView";

class Stuff extends Component {

  constructor(props) {
    super(props);
    this.state = {

                    libraries: [{ 
                      label: "TV",
                      path: "MRAO",
                    }],
                    files: [],
                     path: "",
 
                    filesMow: [{ 
                      label: "",
                      path: "",
                      isDirectory: false
                    }],

                    crumbs: [{ label: "Media", path: "/#/Media" }]
                };  
   this.listLibraries();
   console.log(this.props.location.pathname);
  }
  listLibraries() {
    let apiBaseUrl = "http://192.168.0.138:5000/api/v1/home";
    let token = localStorage.getItem('id_token');
    let self = this;
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }
    axios.get(apiBaseUrl,config)
    .then(function (response) {
        console.log(response);
        if(response.status === 200){
          self.setState({
            libraries: response.data.map(library => ({ label: library, path: `/#/Media/${library}`}))
          })
        } else {
            console.log("A vague error has occured");
        }
    })
    .catch(function (error) {
    console.log(error);
    });
  }
  //hmmmm
  bcClick(path,i) {
    let apiBaseUrl = "http://192.168.0.138:5000/api/v1";
    let token = localStorage.getItem('id_token');
    let self = this;
    const crumbs = this.state.crumbs;
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }
    path = '/' + path;
    axios.get(apiBaseUrl + path,config)
    .then(function (response) {
        console.log(response);
        if(response.status === 200){
          console.log(response.data);          
          self.setState({
            crumbs: crumbs.slice(0,i+1)
          })
          self.setState({
            files: response.data,
            path: path,
          });
        } else {
            console.log("A vague error has occured");
        }
    })
    .catch(function (error) {
    console.log(error);
    });
  }
  handleClick(path){
    let apiBaseUrl = "http://192.168.0.138:5000/api/v1";
    let token = localStorage.getItem('id_token');
    let self = this;
    let currentd = this.state.path + "/" + path;
    
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }
    console.log(this.state.path);

    axios.get(apiBaseUrl+currentd,config)
    .then(function (response) {
        console.log(response);
        if(response.status === 200){
          console.log(response.data);
          self.addCrumb(path);
          self.setState({
            files: response.data,
            path: currentd,
          });
        } else {
            console.log("A vague error has occured");
        }
    })
    .catch(function (error) {
    console.log(error);
    });
  }

  libraryClick(path) {
    
    this.setState(
      { 
        files: [],
        path: "",
        crumbs: [{
          label: "Media",
          path: "/#/Media"
        }]
      }
    ,() => this.handleClick(path)
    );     
  }

  addCrumb(dir){
    const crumbs = this.state.crumbs;
    let npath = crumbs.slice(-1)[0].path + '/' + dir;
    this.setState({
      crumbs: crumbs.concat([{
        label: dir,
        path: npath
      }])
    });
}

  render() {

    let userLibraries = this.state.libraries.map((library,i) => {
        return (
            <RaisedButton
                primary={true}
                path = {library.path}
                label = {library.label}
                key = {i}
                onClick = {() => this.libraryClick(library.label)}
            />
        );
    });

    return (
      <div>
        <MuiThemeProvider>
          <div>
            {userLibraries}
          </div>
        </MuiThemeProvider>

        <br></br>
        <br></br>
        <h3>
          <BreadCrumb 
            rootdir="media" crumbs={this.state.crumbs} onClick = {(foo,bar) => this.bcClick(foo,bar)}>
          </BreadCrumb>
        </h3>


        <FolderView
          directory = {this.state.path} files = {this.state.files} onClick = {(foo) => this.handleClick(foo)}> 
        </FolderView>
      </div>
    );
  }
}

export default Stuff;




