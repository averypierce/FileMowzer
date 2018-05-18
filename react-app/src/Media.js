import React, { Component } from "react";
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import BreadCrumb from "./BreadCrumb";
import FolderView from "./FolderView";

const serverHost = process.env.REACT_APP_SERVER_HOST;


class Stuff extends Component {

  constructor(props) {
    super(props);
    this.state = {

                    libraries: [
                      //{ 
                      //label: "default",
                      //path: "",
                      //}
                    ],

                    currentDirectory: "",
 
                    filesMow: [/*{ 
                      label: "",
                      path: "",
                      type: "",
                      date: "",
                      size: ""
                    }*/],
                    crumbs: []
                };  
   this.getLibraryList();
  }

  dler(url) {
    if(url.startsWith("/#/Media")){
      console.log("trimming '/#/Media' from url for download API call");
      url = url.slice(8);      
    }
    let downloadApiBaseUrl = `https://${serverHost}:5000/download`;

    this.apiCall(url,(response) => {
      if(response.status === 200){
          let link = document.createElement('a');
          link.href = `${downloadApiBaseUrl}${url}?jwt=${response.data.access_token}`;
          link.click();
      }
    },downloadApiBaseUrl) //change apiBaseUrl
  }    

  apiCall(path,cb, apiBaseUrl = `https://${serverHost}:5000/api/v1`){
    let token = localStorage.getItem('id_token');
    let config = {
      headers: {
        Authorization: 'Bearer ' + token,
      }
    }
    axios.get(apiBaseUrl+path,config)
    .then(cb)
    .catch(function (error) {
    console.log(error);
    });
  }
  getLibraryList() {
    let self = this;
    this.apiCall('/home', (response) => {
        if(response.status === 200){
          self.setState({
            libraries: response.data.map(library => ({ label: library, path: `/#/Media/${library}`}))
          })
        }
    });
  }

  masterClick(route) {
    let self = this;
    let apiRoute = route;
    if(route.startsWith("/#/Media")){
      console.log("trimming '/#/Media' from path for API call");
      apiRoute = route.slice(8);      
    }
    this.apiCall(apiRoute, (response) => {
      if(response.status === 200){
        self.buildCrumbs(route);            
        let listing = response.data.folders.map(fmowz => ({label: fmowz.name, path: `${route}/${fmowz.name}`, type: fmowz.type, date: fmowz.ctime, size: "-"}));
        listing = listing.concat(response.data.files.map(fmowz => ({label: fmowz.name, path: `${route}/${fmowz.name}`, type: fmowz.type, date: fmowz.ctime, size: fmowz.size})));
        self.setState({
          filesMow: listing,
          currentDirectory: route,
        });
      }
    })
  }

  buildCrumbs(route) {
    let splitRoute = route.split('/');
    let crumbs = [];
    for(let i = 4; i <= splitRoute.length; i++) {
      crumbs.push({label: splitRoute[i-1], path: splitRoute.slice(0,i).join('/')});
    }
    this.setState({
      crumbs: crumbs
    })
  }

  render() {

    let userLibraries = this.state.libraries.map((library,i) => {
        return (
            <RaisedButton
                primary={true}
                path = {library.path}
                label = {library.label}
                key = {i}
                onClick = {() => this.masterClick(library.path)}
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
        <h3>
          <BreadCrumb 
            rootdir="media" crumbs={this.state.crumbs} onClick = {(foo) => this.masterClick(foo)}>
          </BreadCrumb>
        </h3>


        <FolderView
           files = {this.state.filesMow} dler ={(foo,bar) => this.dler(foo,bar)} onClick = {(foo) => this.masterClick(foo)}> 
        </FolderView>
      </div>
    );
  }
}

export default Stuff;




