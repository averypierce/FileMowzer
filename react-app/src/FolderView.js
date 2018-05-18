import React, { Component } from "react";

function File(props) {
    return (
        <div class="row">
            <a 
                href= { `${props.path}/${props.label}`.replace(/ /g,'_') }
                className ="list-group-item list-group-item-action d-flex flex-row" 
                onClick = {props.onClick}>            
                <div className="mr-auto">{props.icon} {props.label}</div>
                <div className="px-2"> {props.size} </div>
                <div className="px-2 d-none d-sm-block"> {props.date} </div>
            </a>
        </div>
    );
}

class FolderView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contents: props.files,
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            contents: nextProps.files,
        }
    }

    render() {

        let bcbar = this.state.contents.map((entry,i) => {

            let icon = null;
            switch(entry.type) {
                case 'dir':
                    icon = <i className = "material-icons">folder</i>;
                    break;
                case 'mkv':
                case 'avi':
                case 'mp4':
                    icon = <img src="/video.png" width="24" height="24" class="d-inline-block align-middle"></img>;
                    break;
            }
            
            return (                
                <File
                    path = {entry.path}
                    date = {entry.date}
                    size = {entry.size}
                    time = {entry.time}
                    label = {entry.label}
                    icon = {icon}
                    key = {i}
                    onClick = {(foo) => entry.onClick(entry.path)}
                />             
            );            
        });

        return (
            <div>  
                <ul className="list-group list-group-flush">              
                    {bcbar}
                </ul>
            </div>
        )
    }
}

export default FolderView;