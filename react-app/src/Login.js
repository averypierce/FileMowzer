import React, { Component } from "react";

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import axios from 'axios';

const serverHost = process.env.REACT_APP_SERVER_HOST;

class Login extends Component {
    constructor(props){
        super(props);
        this.state={
            username:'',
            password:''
        }
    }

    setToken(token) {
        localStorage.setItem('id_token',token);
    }

 handleClick(event){
    event.preventDefault() //prevent chrome from trying to handle GET and adding ? mark to URL 
    let apiBaseUrl = `https://${serverHost}:5000/`;
    let payload = {
        "username":this.state.username,
        "password":this.state.password
    }
    axios.post(apiBaseUrl+'auth', payload)
    .then(function (response) {
        console.log(response);
        if(response.status === 200){
            console.log("Login successfull");
            let token = response.data.access_token;
            localStorage.setItem('id_token',token);
        }
    })
    .catch(function (error) {
         console.log(error);
    });
    }

render() {
    return (
      <div>
          
        <MuiThemeProvider>
          <div class = "d-flex justify-content-center align-self-center">
          <form onSubmit={(event) => this.handleClick(event)} >
           <TextField
             floatingLabelText="Username"
             onChange = {(event,newValue) => this.setState({username:newValue})}
             />
           <br/>
             <TextField
               type="password"
               floatingLabelText="Password"
               onChange = {(event,newValue) => this.setState({password:newValue})}
               />
             <br/>
             <RaisedButton type="submit" label="Sign In" primary={true}/>
             </form>
         </div>
         </MuiThemeProvider>

      </div>
    );
  }
  
}

export default Login;

