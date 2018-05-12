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
            onClick: props.onClick,
            dler: props.dler,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            contents: nextProps.files,
            directory: nextProps.directory
        }
    }

    render() {

        let bcbar = this.state.contents.map((filename,i) => {
            //should change backend to separate files and folders in results
            if(filename.split('.').pop() === "avi" || filename.split('.').pop() === "mkv"){
                return (
                    <File
                        path = {this.state.directory}
                        label = {filename}
                        key = {i}
                        onClick = {() => this.state.dler(this.state.directory,filename)}
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