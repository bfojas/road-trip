import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserData } from "../../ducks/reducer";
import TripsList from "./TripsList";
import Following from "./Following";
import SavedTrips from "./SavedTrips";
import "./Profile.scss";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
        
        } 
    }

    render() {
        const { match } = this.props;

        return (
            <div className="profile-container">
                <div className="profile-hero">
                    <div className="profile-info">
                        <img src="https://lh3.googleusercontent.com/-csKNN3Qu6rQ/W8ip2qnmf3I/AAAAAAAAAXM/Ba3wXpN8Q6Uc81Rz72LKFpQ4_9PqcXVGACEwYBhgL/w140-h140-p/Resized-JohnMarshall-00170-835.jpg" />
                        <h2>Logan Marshall</h2>
                        <span>@loganxc12</span>
                    </div>
                </div>
                <div className="profile-menu-bar">
                    <div className="profile-menu">
                        <NavLink to="/profile" activeClassName="selected" exact>
                            <div>My Trips</div>
                        </NavLink>
                        <NavLink to="/profile/following" activeClassName="selected">
                            <div>Following</div>
                        </NavLink>
                        <NavLink to="/profile/saved" activeClassName="selected">
                            <div>Saved</div>
                        </NavLink>
                    </div>
                </div>
                { match.path === "/profile" && <TripsList />}
                { match.path === "/profile/following" && <Following /> }
                { match.path === "/profile/saved" && <SavedTrips /> }
            </div>
        );
    }

}


export default connect(null, { updateUserData })(Profile);