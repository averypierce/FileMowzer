import React, { Component } from "react";

function Crumb(props) {
    return (
      <li onClick={props.onClick}>
          <a href= {props.path}>{props.label}</a>
           > 
      </li>
    );
  }

class BreadCrumb extends Component {

    constructor(props) {
        super(props);
        this.state = {
            crumbs: props.crumbs,
            onClick: props.onClick
        };
    }  

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            crumbs: nextProps.crumbs
        }
    }

    render(){

        let bcbar = this.state.crumbs.map((crumb,i) => {
            return (
                <Crumb
                    path = {crumb.path}
                    label = {crumb.label}
                    key = {i}
                    onClick = {() => this.state.onClick(crumb.path.slice(9),i)}
                />
            );
        });

        return (
            <div>                
                <ul id="menu">
                    {bcbar}
                </ul>
            </div>
        )
    }
}

export default BreadCrumb;