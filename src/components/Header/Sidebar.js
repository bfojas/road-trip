import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

export default function Sidebar() {

    return (
        <Menu right>
            <Link to="/map" className="menu-item" >
                Start a new trip
            </Link>
            <Link to="/" className="menu-item" >
                Profile
            </Link>
            <Link to="/" className="menu-item" >
                Explore
            </Link>
            <Link to="/" className="menu-item" >
                Sign out 
            </Link>
        </Menu>
    );

}