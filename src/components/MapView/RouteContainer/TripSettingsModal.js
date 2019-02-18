import React, { Component } from "react";
import axios from "axios";
import ReactS3 from "react-s3";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert"; 
import { updateTripInfo, updateUserTrips, initialTrip } from "../../../ducks/reducer";
import "react-confirm-alert/src/react-confirm-alert.css"; 
import "./TripSettingsModal.scss";

//AWS S3 CONFIGURATION
const config = {
    bucketName: "road-trip-project-bucket",
    region: "us-east-1",
    accessKeyId: process.env.REACT_APP_AWS_ACCESS,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET
}

class TripSettingsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            name: "",
            featuredImage: ""
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.upload = this.upload.bind(this);
        this.updateTripOnServer = this.updateTripOnServer.bind(this);
        this.deleteTripFromServer = this.deleteTripFromServer.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    componentDidUpdate(prevProps) {
        if (this.props.currentTrip && (this.props !== prevProps)) {
            const { currentTrip } = this.props;
            this.setState({
                name: currentTrip.tripName,
                featuredImage: currentTrip.featuredImage
            })
        }
    }
    
    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value })
    }

    handleClose() {
        this.props.closeModal("tripSettingsModal");
    }

    upload(e) {
        ReactS3.uploadFile(e.target.files[0], config).then(data => {
            this.setState({ featuredImage: data.location })
        }).catch(error => console.log(error));
    }

    updateTripOnServer(e) {
        e.preventDefault();
        const { name, featuredImage } = this.state;
        const { tripId } = this.props.currentTrip;
        axios.put("/api/trips", { name, featuredImage, tripId }).then(response => {
            this.props.updateTripInfo(response.data);
            this.handleClose();
        })
    }

    deleteTripFromServer() {
        const { tripId } = this.props.currentTrip;
        const { id } = this.props.user
        axios.delete(`/api/trips/${tripId}`).then(response => {
            console.log(response);
            this.props.updateUserTrips(response.data);
            this.props.updateTripInfo(initialTrip);
            this.handleClose();
            this.props.history.push(`/profile/${id}`);
        })
    }

    confirmDelete() {
		confirmAlert({
			title: "Delete Trip?",
			message: "Are you sure you want to permenently delete this trip from your account?",
			buttons: [
				{
					label: "Yes",
					onClick: () => this.deleteTripFromServer()
				},
				{
					label: "No",
					onClick: () => console.log("clicked no")
				}
			]
		})
	}

    render() { 
        const { name, featuredImage } = this.state;
        const { show } = this.props;
        const showHideClassName = show ? "modal display-flex" : "modal display-none";

        return show ? (  
            <div className={showHideClassName}>
                <section className="trip-settings-modal-main">
                    <i className="fas fa-times-circle" onClick={this.handleClose}></i>
                    <div className="modal-header">
                        <h3>TRIP SETTINGS</h3>
                    </div>
                    <div className="modal-content-wrapper">
                        <form onSubmit={this.updateTripOnServer}>
                            <label>TRIP NAME:</label>
                            <input onChange={this.handleChange} value={name} name="name" type="text" />
                            <label>FEATURED IMAGE:</label>
                            <div className="featured-image" style={{backgroundImage: `url(${featuredImage})`}}>
                                <div className="featured-image-edit">
                                    <label htmlFor="featured-upload">
                                        <i className="fas fa-camera profile"></i>
                                        <span>UPDATE</span>
                                    </label>
                                    <input type="file" onChange={this.upload} name="featuredImage" id="featured-upload" accept="image/*" style={{display:"none"}} />
                                </div>
                            </div>
                            <div className="setting-controls">
                                <button type="submit">SAVE</button>
                                <span onClick={this.confirmDelete} className="hvr-underline-reveal">DELETE</span>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        ) : null;
    }

}

function mapStateToProps(reduxState) {
    const { currentTrip, user } = reduxState;
    return { currentTrip, user };
}
 
export default withRouter(connect(mapStateToProps, { updateTripInfo, updateUserTrips })(TripSettingsModal));