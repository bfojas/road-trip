import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { updateUserData } from "../../ducks/reducer";
import "./Profile.scss";

class EditProfileModal extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            name: "",
            email: "",
            bio: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.updateUserOnServer = this.updateUserOnServer.bind(this);
    }

    componentDidMount() {
        const { user } = this.props;
        const userBio = user.bio || "";
        this.setState({
            name: user.name,
            email: user.email,
            bio: userBio
        })
    }
    
    handleChange(e) {
        this.setState({
            [e.target.name] : e.target.value
        })
    }

    handleClose() {
        this.props.showCoverEdit();
        this.props.hide();
    }

    updateUserOnServer(e) {
        e.preventDefault();
        const { name, email, bio } = this.state;
        const { id, profile_image, cover_image, likedTrips } = this.props.user;
        const updatedUser = { name, email, bio, profile_image, cover_image, likedTrips };
        axios.put(`/api/user/${id}`, updatedUser).then(response => {
            this.props.updateUserData(response.data.users[0]);
            this.props.hide();
        })
    }

    render() { 
        const { name, email, bio } = this.state;
        const { show } = this.props;
        const showHideClassName = show ? "modal display-flex" : "modal display-none";

        return show ? (  
            <div className={showHideClassName}>
                <section className="modal-main">
                    <i className="fas fa-times-circle" onClick={this.handleClose}></i>
                    <div className="modal-content-wrapper">
                        <h3>EDIT YOUR PROFILE</h3>
                        <form onSubmit={this.updateUserOnServer}>
                            <div>
                                <label>NAME:</label><input onChange={this.handleChange} name="name" value={name} placeholder="Full Name" required />
                            </div>
                            <div>
                                <label>EMAIL:</label><input onChange={this.handleChange} name="email" value={email} placeholder="Email Address" required />
                            </div>
                            <div style={{flex: "auto"}}>
                                <label>BIO:</label><textarea onChange={this.handleChange} name="bio" value={bio} placeholder="Short bio goes here" maxLength="100"/>
                            </div>
                            <button type="submit">SAVE</button>
                        </form>
                    </div>            
                </section>
            </div>
        ) : null;
    }
}
 
export default connect(null, { updateUserData })(EditProfileModal);