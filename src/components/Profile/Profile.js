import React, { Component } from "react";
import axios from "axios";
import { NavLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import ReactS3 from "react-s3";
import { updateUserData } from "../../ducks/reducer";
import TripsList from "./TripsList";
import Following from "./Following";
import SavedTrips from "./SavedTrips";
import EditProfileModal from "./EditProfileModal";
import avatar from "../../images/user.png";
import defaultCover from "../../images/default-cover.jpg";
import "./Profile.scss";

//AWS S3 CONFIGURATION
const config = {
    bucketName: "road-trip-project-bucket",
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET
}

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showCoverEdit: false,
            showModal: false
        }
        this.showCoverEdit = this.showCoverEdit.bind(this);
        this.hideCoverEdit = this.hideCoverEdit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.upload = this.upload.bind(this);
        this.updateUserPhotoOnServer = this.updateUserPhotoOnServer.bind(this);
    }

    showCoverEdit() {
        this.setState({ showCoverEdit: true })
    }

    hideCoverEdit() {
        this.setState({ showCoverEdit: false })
    }

    toggleModal() {
        let modalState = this.state.showModal;
        this.setState({ showModal: !modalState })
    }

    upload(e) {
        const target = e.target.name;
        ReactS3.uploadFile(e.target.files[0], config).then(data => {
            this.updateUserPhotoOnServer(target, data.location);
        }).catch(error => console.log(error));
    }

    updateUserPhotoOnServer(type, url) {
        const { user, updateUserData } = this.props;
        const updatedUser = Object.assign({}, user, { [type]: url });
        axios.put(`/api/user/${user.id}`, updatedUser).then(response => {
            updateUserData(response.data.users[0]);
        })
    }

    render() {
        const { showCoverEdit, showModal } = this.state;
        const { match, user, trips } = this.props;
        const profileImage = user ? user.profile_image || avatar : avatar;
        const coverImage = user ? user.cover_image || defaultCover : defaultCover;
        const coverEditStyle = showCoverEdit ? { display: "flex" } : { display: "none" };
        const coverIconStyle = showCoverEdit ? { fontSize: "18px"} : { fontSize: "24px"};

        return user ? (
            <div className="profile-container">
                <EditProfileModal
                    show={showModal}
                    hide={this.toggleModal}
                    user={user}
                    showCoverEdit={this.showCoverEdit}
                />
                <div className="profile-hero" 
                    style={{backgroundImage: `url(${coverImage})`}}
                    onMouseEnter={this.showCoverEdit}
                    onMouseLeave={this.hideCoverEdit}
                >
                    <i className="fas fa-camera cover-edit-icon" style={coverIconStyle}></i>
                    <div className="cover-edit-box" style={coverEditStyle}>
                        <label htmlFor="cover-upload">EDIT COVER PHOTO</label>
                        <input type="file" name="cover_image" onChange={this.upload} id="cover-upload" accept="image/*" style={{display:'none'}} />
                    </div>
                    <div className="update-info" 
                        onClick={this.toggleModal}
                        onMouseEnter={this.hideCoverEdit}
                        onMouseLeave={this.showCoverEdit}
                    >
                        <span>UPDATE INFO</span>
                    </div>
                    <div className="profile-info">
                        <div className="profile-image" style={{backgroundImage: `url(${profileImage})`}}>
                            <div className="profile-edit"
                                onMouseEnter={this.hideCoverEdit}
                                onMouseLeave={this.showCoverEdit}
                            >
                                <label htmlFor="profile-upload">
                                    <i className="fas fa-camera profile"></i>
                                    <span>UPDATE</span>
                                </label>
                                <input type="file" name="profile_image" onChange={this.upload} id="profile-upload" accept="image/*" style={{display:"none"}} />
                            </div>
                        </div>
                        <h2>{user.name}</h2>
                        <div className="user-bio">{user.bio || "Short bio goes here."}</div>
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
                { match.path === "/profile" && <TripsList trips={trips} />}
                { match.path === "/profile/following" && <Following /> }
                { match.path === "/profile/saved" && <SavedTrips /> }
            </div>
        ) :null
        // <Redirect to="/" />
    }

}

function mapStateToProps(reduxState) {
    const { user, trips } = reduxState;
    return { user, trips }
}

export default connect(mapStateToProps, { updateUserData })(Profile);