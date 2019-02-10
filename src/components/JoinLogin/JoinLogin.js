import React, { Component } from "react";
import axios from "axios";
import { Redirect } from "react-router-dom";
import alertify from "alertifyjs";
import { connect } from "react-redux";
import { updateUserData, updateTripInfo } from "../../ducks/reducer";
import "./JoinLogin.scss";

class JoinLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            redirect: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
        this.loginUser = this.loginUser.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name] : e.target.value })
    }

    registerUser(e) {
        e.preventDefault();
        const { name, email, password } = this.state;
        const { updateUserData } = this.props;
        const newUser = { name, email, password };
        axios.post("/auth/register", newUser).then(response => {
            if (response.data.errorMessage) {
                alertify.error(response.data.errorMessage);
            } else {
                updateUserData(response.data);
                alertify.success("Success! Welcome to Road Trip");
                this.setState({ redirect: true })
            }
        })
    }

    loginUser(e) {
        e.preventDefault();
        const { email, password } = this.state;
        const { updateUserData, updateTripInfo } = this.props;
        const user = { email, password };
        axios.post("/auth/login", user).then(async response => {
            if (response.data.errorMessage) {
                alertify.error(response.data.errorMessage);                
            } else {
                console.log('current', response.data.currentTrip)
                const {user, currentTrip} = response.data
                updateUserData(user);
                updateTripInfo(currentTrip)
                alertify.success("You have successfully logged in");
                this.setState({ redirect: true })
            }
        })
    }

    render() {
        const { name, email, password, redirect } = this.state;
        const title = this.props.match.path.replace(/^./, "").toUpperCase();

        if (redirect) { return <Redirect to="/map" />; }

        return (
            <div className="login-container">
                <section>
                    <div className="login-title">
                        <h1>{title}</h1>
                        {
                            title === "REGISTER" ?
                            <p>Create an account to start planning your next great adventure on the open road!</p> :
                            <p>Welcome back! Login here to plan your next great adventure on the open road.</p>
                        }
                    </div>
                </section>
                <section className="login-form-wrapper">
                    <div className="login-form">
                        <form onSubmit={title === "REGISTER" ? this.registerUser : this.loginUser}>
                            { 
                                title === "REGISTER" ?
                                <input onChange={this.handleChange} name="name" value={name} placeholder="Full Name" required/>
                                : null
                            }
                            <input onChange={this.handleChange} name="email" value={email} placeholder="Email Address" required/>
                            <input type="password" onChange={this.handleChange} name="password" value={password} placeholder="Password" required/>
                            <button type="submit">{title === "REGISTER" ? "CREATE ACCOUNT" : "LOG ME IN"} <i className="fas fa-long-arrow-alt-right"></i></button>
                        </form>
                    </div>
                </section>
            </div>
        );
    }

}


const mapDispatchToProps = {
    updateUserData, updateTripInfo
}

export default connect(null, mapDispatchToProps)(JoinLogin);