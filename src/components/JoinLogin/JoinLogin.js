import React, { Component } from "react";
import axios from "axios";
import alertify from "alertifyjs";

class JoinLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: ""
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
        const newUser = { name, email, password };
        axios.post("/auth/register", newUser).then(response => {
            if (response.data.errorMessage) {
                alertify.error(response.data.errorMessage);
            }
        })

    }

    loginUser(e) {
        e.preventDefault();
        const { email, password } = this.state;
        const user = { email, password };
        axios.post("/auth/login", user).then(response => {
            if (response.data.errorMessage) {
                alertify.error(response.data.errorMessage);                
            }
        })
    }

    render() {
        const { name, email, password, errorMessage } = this.state;
        const title = this.props.match.path.replace(/^./, "").toUpperCase();
        return (
            <div>
                <h1>{title}</h1>
                {
                    title === "REGISTER" ?
                    <p>Create an account to start planning your next great adventure on the open road.</p> :
                    <p>Welcome back. Login below to plan your next great adventure on the open road.</p>
                }
                <form onSubmit={title === "REGISTER" ? this.registerUser : this.loginUser}>
                    { 
                        title === "REGISTER" ?
                        <input onChange={this.handleChange} name="name" value={name} placeholder="Full Name" required/>
                        : null
                    }
                    <input onChange={this.handleChange} name="email" value={email} placeholder="Email Address" required/>
                    <input type="password" onChange={this.handleChange} name="password" value={password} placeholder="Password" required/>
                    <button type ="submit">{title}</button>
                </form>
                <p>{ errorMessage ? errorMessage : null }</p>
            </div>
        );
    }

}

export default JoinLogin;