import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import "./TripSettingsModal.scss";

class TripSettingsModal extends Component {

    constructor(props) {
        super(props);
        this.state = {  
            selectedTrip: null
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    
    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value })
    }

    handleClose() {
        this.props.closeModal("tripSettingsModal");
    }

    render() { 
        const { selectedTrip } = this.state;
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
                        <form>
                            <label>TRIP NAME:</label>
                            <input type="text" />
                            <label>FEATURED IMAGE:</label>
                            <div className="featured-image">
                                <div className="featured-image-edit">
                                    <label htmlFor="profile-upload">
                                        <i className="fas fa-camera profile"></i>
                                        <span>UPDATE</span>
                                    </label>
                                    <input type="file" name="featured_image" accept="image/*" style={{display:"none"}} />
                                </div>
                            </div>
                            <div className="setting-controls">
                                <button type="submit">SAVE</button>
                                <span>DELETE <i className="fas fa-trash"></i></span>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        ) : null;
    }
}
 
export default TripSettingsModal;