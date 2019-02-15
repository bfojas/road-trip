import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { updateUserData, updateUserTrips, updateTripInfo } from "../../ducks/reducer";
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
        this.getTripsFromServer = this.getTripsFromServer.bind(this);
        this.logout = this.logout.bind(this);
        this.startNewTrip = this.startNewTrip.bind(this);
        this.getHomePageTripsFromServer = this.getHomePageTripsFromServer.bind(this)
    }

    componentDidMount() {
        this.getUserFromServer();
        this.getHomePageTripsFromServer()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.user && this.props.location.pathname !== nextProps.location.pathname) {
            this.getTripsFromServer();
        }
    }

    hideNav = () => {
        this.setState({ showNav: false })
    }

    getUserFromServer() {
        axios.get("/auth/user-data").then(response => {
            const { updateUserData, updateTripInfo } = this.props;
            updateUserData(response.data.user);
            updateTripInfo(response.data.currentTrip);
            if (response.data.user){
                this.getTripsFromServer();
            } else if (!response.data.user && this.props.location.pathname === "/profile") {
                this.props.history.push("/");
            }
      });
    }

    getTripsFromServer() {
        axios.get("/api/trips").then(response => {
            const { updateUserTrips } = this.props;
            updateUserTrips(response.data);
        })
    }

    getHomePageTripsFromServer() {
        axios.get("/api/home-trips").then(response => {
            console.log('response', response)
        })
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
        const { user } = this.props;
        const path = this.props.location.pathname.replace(/^./, "");
        const homePath = !path || path === "login" || path === "register";
        const headerStyles = (path === "login" || path === "register" || !path) ? 
            { backgroundColor: "transparent", position: "fixed" } : null;
        const headerNavStyles = !path ? { display: "flex" } : { display: "none" };
        const logoToDisplay = path === "login" || path === "register" ? logoDark : logo;
        const userImage = !user ? null : !user.profile_image ? "https://image.flaticon.com/icons/svg/189/189626.svg" : user.profile_image;

        return (
            <div className="header-container" style={headerStyles}>
                <div className="logo">
                    <Link to="/"><img src={logoToDisplay} alt="logo" /></Link>
                </div>
                <div className="header-nav" style={headerNavStyles}>
                    <ul>
                        <Link to="/register"><li>Sign Up</li></Link>
                        <Link to="/login"><li>Login <i className="fas fa-sign-in-alt"></i></li></Link>
                    </ul>
                </div>
                { 
                    user && !homePath ?
                        <Link to="/profile">
                            <div className="profile-image" style={{backgroundImage: `url(${userImage})`}}>
                                {/* <div className="alert-circle">4</div> */}
                            </div>
                        </Link>

                    : null
                }
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

export default withRouter(connect(mapStateToProps, { updateUserData, updateUserTrips, updateTripInfo })(Header));
