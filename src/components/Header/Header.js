import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { updateUserData } from '../../ducks/reducer';
import Sidebar from "./Sidebar";
import logo from "../../images/logo.png";
import logoDark from "../../images/logo-dark.png";
import "./Header.scss";

class Header extends Component {
    constructor(props) {
        super(props);
        this.getUserFromServer = this.getUserFromServer.bind(this);
        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        this.getUserFromServer();
    }

    toggleMenu = () => {
        this.setState((prevState) => {
            return {
                toggle: !prevState.toggle
            }
        })
    }

    getUserFromServer() {
        axios.get("/auth/user-data").then(response => {
            const { updateUserData } = this.props;
            updateUserData(response.data.user);
      });
    }

    logout() {
        axios.post("/auth/logout").then(response => {
            console.log(response);
            const { updateUserData } = this.props;
            if (!response.data) { updateUserData(null); }
        });
    }

    render() {
        const path = this.props.location.pathname.replace(/^./, "");
        const headerStyles = (path === "login" || path === "register") ? 
            { backgroundColor: "transparent", position: "fixed" } : null
        const showHeaderNav = path === "" ? { display: "flex" } : { display: "none" };
        const logoToDisplay = path === "login" || path === "register" ? logoDark : logo;

        return (
            <div className="header-container" style={headerStyles}>
                <div className="logo">
                    <Link to="/"><img src={logoToDisplay} /></Link>
                </div>
                <div className="header-nav" style={showHeaderNav}>
                    <ul>
                        <Link to="/map"><li>Plan a Trip</li></Link>
                        <Link to="/map"><li>Explore</li></Link>
                        <Link to="/register"><li>Sign Up</li></Link>
                    </ul>
                </div>
                <div className="profile-image">
                    <div className="alert-circle">4</div>
                </div>
                <Sidebar />
            </div>
        );
    }
}

const mapStateToProps = (state) =>{
    return {
        user: state.user

    }
}

export default withRouter(connect(mapStateToProps, { updateUserData })(Header));
