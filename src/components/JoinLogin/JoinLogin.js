import React, { Component } from "react";
import axios from "axios";

class JoinLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: ""
        }
    }

    render() {
        return (
            <div>Join Login</div>
        );
    }

}

export default JoinLogin;