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
            showModal: false, 
            loading: false,
            profile: 0
        }
        this.showCoverEdit = this.showCoverEdit.bind(this);
        this.hideCoverEdit = this.hideCoverEdit.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.upload = this.upload.bind(this);
        this.updateUserPhotoOnServer = this.updateUserPhotoOnServer.bind(this);
        this.getProfile = this.getProfile.bind(this)
    }

    componentDidMount() {
        this.getProfile()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.match.params !== this.props.match.params) {
            this.getProfile()
        }
        if (prevProps.user !== this.props.user) {
            this.getProfile()
        }
    }

    getProfile(){
        console.log('-------profile hit')
        const { user } = this.props;
        const { id } = this.props.match.params;
        if(user.id !== +id) {
            axios.get(`/user/get-profile/${id}`)
                .then(profile => {
                    console.log('---prefile',profile.data)
                    this.setState({profile: profile.data})
                })
        } else {
            this.setState({profile: user})
            console.log('----state', this.state.profile)
        }
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
        this.setState({ loading: target, lockHovers: true });
        ReactS3.uploadFile(e.target.files[0], config).then(data => {
            this.updateUserPhotoOnServer(target, data.location);
        }).catch(error => console.log(error));
    }

    updateUserPhotoOnServer(type, url) {
        const { user, updateUserData } = this.props;
        const updatedUser = Object.assign({}, user, { [type]: url });
        axios.put(`/api/user/${user.id}`, updatedUser).then(response => {
            updateUserData(response.data.users[0]);
            this.setState({ loading: false, lockHovers: false })
        })
    }

    render() {
        const { showCoverEdit, showModal, loading, profile } = this.state;
        const { match, user, trips } = this.props;
        const profileImage = profile ? profile.profile_image || avatar : avatar;
        const coverImage = profile ? profile.cover_image || defaultCover : defaultCover;
        const coverEditStyle = profile.id === user.id && showCoverEdit ? { display: "flex" } : { display: "none" };
        const coverIconStyle = showCoverEdit ? { fontSize: "18px"} : { fontSize: "24px"};
        const profileLoadingStyle = loading === "profile_image" ? { display: "flex" } : { display: "none" };
        const coverLoadingStyle = loading === "cover_image" ? { display: "flex", margin: "0 auto"} : { display: "none" };
        const lockHover = loading ? { display: "none" } : null;
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
                >   {profile.id === user.id 
                    ? <i className="fas fa-camera cover-edit-icon" style={coverIconStyle}></i>
                    : null}
                    <div className="cover-edit-box" style={coverEditStyle}>
                        <label htmlFor="cover-upload" style={lockHover}>EDIT COVER PHOTO</label>
                        <label style={coverLoadingStyle}>UPLOADING...</label>
                        <input type="file" name="cover_image" onChange={this.upload} id="cover-upload" accept="image/*" style={{display:'none'}} />
                    </div>
                    {profile.id === user.id
                    ? <div className="update-info" 
                        onClick={this.toggleModal}
                        onMouseEnter={this.hideCoverEdit}
                        onMouseLeave={this.showCoverEdit}
                    >
                        <span>UPDATE INFO</span>
                    </div>
                    : <i className="fas fa-user-plus"></i>}
                    <div className="profile-info">
                        <div className="profile-image" style={{backgroundImage: `url(${profileImage})`}}>
                            {profile.id === user.id
                            ? <div className="profile-edit"
                                style={lockHover}
                                onMouseEnter={this.hideCoverEdit}
                                onMouseLeave={this.showCoverEdit}
                            >
                                <label htmlFor="profile-upload">
                                    <i className="fas fa-camera profile"></i>
                                    <span>UPDATE</span>
                                </label>
                                <input type="file" name="profile_image" onChange={this.upload} id="profile-upload" accept="image/*" style={{display:"none"}} />
                            </div>
                            : null}
                            <div className="loading" style={profileLoadingStyle}><span>UPLOADING...</span></div>
                        </div>
                        <h2>{profile.name}</h2>
                        <div className="user-bio">{profile.bio || "Short bio goes here."}</div>
                    </div>
                </div>
                <div className="profile-menu-bar">
                    <div className="profile-menu">
                        <NavLink to={`/profile/${profile.id}`} activeClassName="selected" exact>
                            <div>Trips</div>
                        </NavLink>
                        <NavLink to={`/profile/${profile.id}/following`} activeClassName="selected">
                            <div>Following</div>
                        </NavLink>
                        <NavLink to={`/profile/${profile.id}/saved`} activeClassName="selected">
                            <div>Saved</div>
                        </NavLink>
                    </div>
                </div>
                { match.path === "/profile/:id" && <TripsList trips={trips} profile={profile}/> }
                { match.path === "/profile/:id/following" && <Following profile={profile} /> }
                { match.path === "/profile/:id/saved" && <SavedTrips profile={profile} /> }
            </div>
        ) : null;
    }

}

function mapStateToProps(reduxState) {
    const { user, trips } = reduxState;
    return { user, trips }
}

export default connect(mapStateToProps, { updateUserData })(Profile);