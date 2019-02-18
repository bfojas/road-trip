import React from "react";
import { slide as Menu } from "react-burger-menu";
import { Link } from "react-router-dom";
import "./Sidebar.scss";

export default function Sidebar(props) {
    const { show, hide, startNew, logout, path, user } = props;
    const hideSidebar = (path === "login" || path === "register");
    const barColor = path === "" ? "#373a47" : "#fff"
    return !hideSidebar ? (
        <Menu right isOpen={show} 
            styles={{bmBurgerBars: {
            background: barColor
          }}}>
            <Link onClick={startNew} to="/map" className="menu-item" >
                New trip
            </Link>
            <Link to={`/profile/${user.id}`} className="menu-item" onClick={hide}>
                Profile
            </Link>
            <Link to="/" className="menu-item" onClick={hide}>
                Explore
            </Link>
            <Link to="/" className="menu-item" onClick={logout}>
                Sign out 
            </Link>
        </Menu>
    ) : null;

}