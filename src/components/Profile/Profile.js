import React, { Component } from "react";
import { connect } from "react-redux";
import { updateUserData } from "../../ducks/reducer";

import "./JoinLogin.scss";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
        
        }
        
    }

    render() {

        return (
            <div className="profile-container">
                
            </div>
        );
    }

}


export default connect(null, { updateUserData })(Profile);