import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserData } from "../../ducks/reducer";
import TripsList from "./TripsList";
import Following from "./Following";
import SavedTrips from "./SavedTrips";
import avatar from "../../images/batman.png";
import defaultCover from "../../images/default-cover.jpg"
import "./Profile.scss";

class Profile extends Component {

    render() {
        const { match, user } = this.props;
        const coverImage = user ? user.cover_image || defaultCover : defaultCover;

        return user ? (
            <div className="profile-container">
                <div className="profile-hero" style={{backgroundImage: `url(${coverImage})`}}>
                    <div className="profile-info">
                        <img src={user.profile_image || avatar} />
                        <h2>{user.name}</h2>
                        <span>{user.bio || "Short bio goes here."}</span>
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
        ) : null;
    }

}

function mapStateToProps(reduxState) {
    const { user } = reduxState;
    return { user }
}

export default connect(mapStateToProps, { updateUserData })(Profile);