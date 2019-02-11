import React, { Component } from "react";
import AutoComplete from "react-google-autocomplete";
import { GoogleApiWrapper } from "google-maps-react";
import { connect } from "react-redux";
import AddStop from "../AddStop/AddStop";

class RouteContainer extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className="route-container">
                <AddStop/>
                this is the route container
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user,
        currentTrip: state.currentTrip
    }
}

const mapDispatchToProps = {}

const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(RouteContainer);
export default connect(mapStateToProps, mapDispatchToProps)(wrappedRoute);