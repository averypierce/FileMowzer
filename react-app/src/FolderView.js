import React, { Component } from "react";

function File(props) {
    return (
        <a 
            href= { `${props.path}/${props.label}`.replace(/ /g,'_') }
            className ="list-group-item list-group-item-action d-flex flex-row" 
            onClick = {props.onClick}>            
            <div className="mr-auto"><i className = "material-icons">{props.icon}</i> {props.label}</div>
            <div className="px-2"> {props.size} </div>
            <div className="px-2"> {props.date} </div>
        </a>
    );
}
function Video(props) {
    return (
        <a 
            href= { `${props.path}/${props.label}`.replace(/ /g,'_') }
            className ="list-group-item list-group-item-action d-flex flex-row" 
            onClick = {props.onClick}>            
            <div className="mr-auto"><div className="mr-auto"><img src="/mkv.png" width="24" height="24" class="d-inline-block align-middle"></img> {props.label}</div></div>
            <div className="px-2"> {props.size} </div>
            <div className="px-2"> {props.date} </div>
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
            if(entry.type === 'dir'){
                return (                
                    <File
                        path = {entry.path}
                        date = {entry.date}
                        size = {entry.size}
                        time = {entry.time}
                        label = {entry.label}
                        icon = 'folder'
                        key = {i}
                        onClick = {() => this.state.onClick(entry.path)}
                    />             
                );
            }
            if(entry.type === 'mkv' || entry.type === 'avi' || entry.type === 'mp4'){
                return (
                <Video
                    path = {entry.path}
                    label = {entry.label}
                    date = {entry.date}
                    size = {entry.size}
                    time = {entry.time}
                    icon = {''}
                    key = {i}
                    onClick = {() => this.state.dler(entry.path)}
                />
            )}
            return (                
                <File
                    path = {entry.path}
                    date = {entry.date}
                    size = {entry.size}
                    time = {entry.time}
                    label = {entry.label}
                    icon = ''
                    key = {i}
                    onClick = {() => this.state.onClick(entry.path)}
                />             
            );

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