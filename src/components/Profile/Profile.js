import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { updateUserData } from "../../ducks/reducer";
import TripsList from "./TripsList";
import Following from "./Following";
import SavedTrips from "./SavedTrips";
import avatar from "../../images/batman.png";
import defaultCover from "../../images/default-cover.jpg";
import mountain from "../../images/mountain-road.jpg";
import "./Profile.scss";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCoverEdit: false
        }
    }

    toggle = () => {
        let coverState = this.state.showCoverEdit;
        this.setState({
            showCoverEdit: !coverState
        })
    }

    render() {
        const { showCoverEdit } = this.state;
        const { match, user } = this.props;
        const profileImage = user ? user.profile_image || avatar : avatar;
        const coverImage = user ? user.cover_image || defaultCover : defaultCover;
        const coverEditStyle = showCoverEdit ? { display: "flex" } : { display: "none" };
        const coverIconStyle = showCoverEdit ? { fontSize: "18px"} : { fontSize: "24px"};

        return user ? (
            <div className="profile-container">
                <div className="profile-hero" 
                    style={{backgroundImage: `url(${coverImage})`}}
                    onMouseEnter={this.toggle}
                    onMouseLeave={this.toggle}
                >
                    <i className="fas fa-camera cover-edit-icon" style={coverIconStyle}></i>
                    <div className="cover-edit-box" style={coverEditStyle}>
                        <span>EDIT COVER PHOTO</span>
                    </div>
                    <div className="profile-info">
                        <div className="profile-image" style={{backgroundImage: `url(${profileImage})`}}>
                            <div className="profile-edit">
                                <i className="fas fa-camera profile"></i>
                                <span>UPDATE</span>
                            </div>
                        </div>
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