import React, { Component } from "react";
import axios from 'axios';

function File(props) {
    return (
        <a  href={"#/Media"+props.path+"/"+props.label} 
            class="list-group-item list-group-item-action"
            onClick = {props.onClick}> 
                {props.label} 
        </a>
    );
}

function Folder(props) {
    return (
        <a 
            href = {"#/Media" + props.path + "/" + props.label}
            class ="list-group-item list-group-item-action" 
            onClick = {props.onClick}>
                <i class = "material-icons">folder</i> {props.label}
        </a>
    );
}

class FolderView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            directory: props.directory,
            contents: props.files,
            onClick: props.onClick
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            contents: nextProps.files,
            directory: nextProps.directory
        }
    }

    dler(directory, filename) {
        let anchor = document.createElement("a");
        let path =  directory + '/' + filename;
        let file = 'http://192.168.0.138:5000/download' + path;
        let token = localStorage.getItem('id_token');
        let config = {
            headers: {
              Authorization: 'Bearer ' + token,
            }
        }  
        axios.get(file,config)
        .then((response) =>  {
            if(response.status === 200){
                let link = document.createElement('a');
                document.body.appendChild(link);
                link.href = `${file}?jwt=${response.data.access_token}`;
                link.setAttribute('type', 'hidden');
                link.click();
            }
        })
        .catch(function (error) {
        console.log(error);
        });

    }    

    render() {

        let bcbar = this.state.contents.map((filename,i) => {

            if(filename.split('.').pop() === "avi" || filename.split('.').pop() === "mkv"){
                return (
                    <File
                        path = {this.state.directory}
                        label = {filename}
                        key = {i}
                        onClick = {() => this.dler(this.state.directory,filename)}
                    />
                )
            } //else
                return (                
                    <Folder
                        path = {this.state.directory}
                        label = {filename}
                        key = {i}
                        onClick = {() => this.state.onClick(filename)}
                    />             
                );
        });

        return (
            <div>  
                <ul class="list-group list-group-flush ">              
                    {bcbar}
                </ul>
            </div>
        )
    }
}

export default FolderView;