import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

export default function Sidebar(props) {
    const { show, hide } = props;
    const burgerClass = !props.path ? "homepage-nav" : null;
    return (
        <Menu right burgerBarClassName={burgerClass} isOpen={show} >
            <Link to="/map" className="menu-item" onClick={hide}>
                Start a new trip
            </Link>
            <Link to="/profile" className="menu-item" onClick={hide}>
                Profile
            </Link>
            <Link to="/" className="menu-item" onClick={hide}>
                Explore
            </Link>
            <Link to="/" className="menu-item" onClick={hide}>
                Sign out 
            </Link>
        </Menu>
    );

}