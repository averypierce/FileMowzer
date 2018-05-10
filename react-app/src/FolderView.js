import React, { Component } from "react";

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

    //This function oughta be refactoered to outside this view and passed in
    //discussion thread: https://stackoverflow.com/questions/29452031/how-to-handle-file-downloads-with-jwt-based-authentication
    dler(path) {
        let anchor = document.createElement("a");
        let file = 'http://192.168.0.138:5000/download/';
        console.log("path is: " + path)
        return "nah"
        let token = localStorage.getItem('id_token');
        let headers = new Headers();
        headers.append('Authorization', 'Bearer ' + token);
    
        fetch(file, { headers })
            .then(response => response.blob())
            .then(blobby => {
                let objectUrl = window.URL.createObjectURL(blobby);
                anchor.href = objectUrl;
                anchor.download = 'test.txt';
                anchor.click();
                window.URL.revokeObjectURL(objectUrl);
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
                        onClick = {() => this.dler(filename)}
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