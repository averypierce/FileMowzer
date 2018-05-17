import React, { Component } from "react";

function File(props) {
    return (
        <a  href= { `#/Media${props.path}/${props.label}`.replace(/ /g,'_') }
        realurl = {"#/Media"+props.path+"/"+props.label}
            
            className="list-group-item list-group-item-action d-flex"
            onClick = {props.onClick}>
            <div className="mr-auto"> {props.label}</div>
            <div className="px-2">{props.size} </div>
            <div className="px-2"> {props.date}</div>
        </a>
    );
}

function Folder(props) {
    return (
        <a 
        href= { `#/Media${props.path}/${props.label}`.replace(/ /g,'_') }
        realurl = {"#/Media"+props.path+"/"+props.label}
        className ="list-group-item list-group-item-action d-flex flex-row" 
        onClick = {props.onClick}>
            
            <div className="mr-auto"><i className = "material-icons">folder</i> {props.label}</div>
            <div className="px-2">- </div>
            <div className="px-2"> {props.date}</div>
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

        let bcbar = this.state.contents.map((entry,i) => {
            //should change backend to separate files and folders in results
            if(entry.type == 'dir'){
                return (                
                    <Folder
                        path = {this.state.directory}
                        date = {entry.date}
                        size = {entry.size}
                        time = {entry.time}
                        label = {entry.label}
                        key = {i}
                        onClick = {() => this.state.onClick(entry.label)}
                    />             
                );
            }
            
                return (
                    <File
                        path = {this.state.directory}
                        label = {entry.label}
                        date = {entry.date}
                        size = {entry.size}
                        time = {entry.time}
                        key = {i}
                        onClick = {() => this.state.dler(this.state.directory,entry.label)}
                    />
                )

        });

        return (
            <div>  
                <ul className="list-group list-group-flush ">              
                    {bcbar}
                </ul>
            </div>
        )
    }
}

export default FolderView;