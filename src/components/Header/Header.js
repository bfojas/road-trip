import './Header.scss';
import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateUserData } from '../../ducks/reducer';

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            toggle: "hide"
        }
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

    render(){
        let navHide = "block"
        let profileHide = "none"
        let headerColor = '#2955D9'
        console.log("match",this.props.match)
        if (this.props.match.path === '/')
        {}

        return (
            <div className="header-container" 
            style={{backgroundColor: headerColor}}>
                <div className="header-icon">
                Header
                </div>
                <div className="header-nav"
                style={{display: navHide}}>
                    <ul>
                        <li>Plan a Trip</li>
                        <li>Explore</li>
                        <li>Sign Up</li>
                    </ul>
                </div>
                <div className="header-user" style={{display: profileHide}}>
                    <img src="" alt="user-profile"
                    onError={(e)=>{e.target.onerror = null; 
                        e.target.src="images/unavailable.jpg"}}
                    />
                </div>
                <div className="header-menu" onClick={()=>this.toggleMenu()}>
                    <div className="header-burger"></div>
                    <div className="header-burger"></div>
                    <div className="header-burger"></div>
                </div>
                <ul className={this.state.toggle?"hide-menu": "show-menu"}>
                    <li>Plan a Trip</li>
                    <li>Explore</li>
                    <li>Sign Up</li>
                </ul>
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
