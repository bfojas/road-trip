import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { updateUserData, updateTripInfo } from '../../ducks/reducer';
import Sidebar from "./Sidebar";
import logo from "../../images/logo.png";
import logoDark from "../../images/logo-dark.png";
import "./Header.scss";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNav: false
        }
        this.getUserFromServer = this.getUserFromServer.bind(this);
        this.logout = this.logout.bind(this);
        this.startNewTrip = this.startNewTrip.bind(this);
    }

    componentDidMount() {
        this.getUserFromServer();
    }

    hideNav = () => {
        this.setState({ showNav: false })
    }

    getUserFromServer() {
        axios.get("/auth/user-data").then(response => {
            const { updateUserData, updateTripInfo } = this.props;
            updateUserData(response.data.user);
            updateTripInfo(response.data.currentTrip);
      });
    }

    startNewTrip() {
        this.props.updateTripInfo({
            tripOrigin: null,
            tripDestination: null,
            tripName: '',
            tripWaypoints: [],
            tripId: 0
        });
        axios.delete("/api/new-trip").catch(error => console.log("New trip error", error));
        this.hideNav()
        // this.props.history.push('/map')
    }

    logout() {
        axios.post("/auth/logout").then(response => {
            const { updateUserData, updateTripInfo } = this.props;
            if (!response.data) { 
                updateUserData(null);
                updateTripInfo({
                    tripOrigin: null,
                    tripDestination: null,
                    tripName: '',
                    tripWaypoints: [],
                    tripId: 0
                })
            }
        });
        this.hideNav()
    }

    render() {
        const { showNav } = this.state;
        const path = this.props.location.pathname.replace(/^./, "");
        const headerStyles = (path === "login" || path === "register" || path === "") ? 
            { backgroundColor: "transparent", position: "fixed" } : null;
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
                {/* <div className="profile-image">
                    <div className="alert-circle">4</div>
                </div> */}
                <Sidebar 
                    className="sidebar" 
                    path={path} 
                    show={showNav} 
                    startNew={this.startNewTrip} 
                    logout={this.logout}
                    hide={this.hideNav} />
            </div>
        );
    }
}

const mapStateToProps = state =>{
    return {
        user: state.user

    }
}

export default withRouter(connect(mapStateToProps, { updateUserData, updateTripInfo })(Header));
