import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AutoComplete from "react-google-autocomplete";
import { GoogleApiWrapper } from "google-maps-react";
import { addStop } from "../../../ducks/reducer";

class AddStop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            address: "",
            image: "",
            latitude: "",
            longitude: "",
            wait: true,
            buttonDisable: true
        }
    }

    pickStop = location => {
        // Destructure values from selected location.
        const { formatted_address } = location;
        const { long_name } = location.address_components[0];
        const imageSet = location.photos ? location.photos[0].getUrl() : null;
        const latSet = location.geometry.location.lat();
        const lngSet = location.geometry.location.lng();
        // Set selected location values to state.
        this.setState({
            name: long_name,
            address: formatted_address,
            image: imageSet,
            latitude: latSet,
            longitude: lngSet,
            buttonDisable: false
        })
    }

    addStop = () => {
        //Destructure from Redux currentTrip object and selected stop values in state.
        const { tripId, tripOrigin } = this.props.currentTrip;
        const { name, address, image, latitude, longitude } = this.state;
        //Calculate distance from origin location.
        let start_distance = this.getDistance(tripOrigin, latitude, longitude);
        // Add stop to database.        
        let newStopId = axios.put("/map/add", { tripId, start_distance, stop: { name, address, image, latitude, longitude } });

        // create new waypoint array.       
        let newList = this.props.tripWaypoints.slice();
        let newStop = { name, address, image, latitude, longitude, start_distance, id: newStopId };
        let newWaypointArray = [];
        // Determines and returns index to insert stop in waypoint array based on distance from start point.
        let insertInOrder = index => {
            var newIndex;
            if (index === newList.length) {
                newIndex = index;
            } else if (newList[index].start_distance < start_distance) {
                return insertInOrder(index + 1);
            } else {
                newIndex = index;
            }
            return newIndex;
        }
        // Splices/pushes new stop into waypoint array based on distance from start point.
        if (newList.length) {
            let insertIndex = insertInOrder(0);
            newList.splice(insertIndex, 0 , newStop);
        } else {
            newList.push(newStop);
        }
        // Sends new waypoint array to Redux        
        this.props.addStop(newList)
    }

    //Calculates distance from origin location for new stop.
    getDistance = (start, latitude, longitude) => {
        let aSquare = Math.pow(Math.abs(start.latitude - latitude), 2);
        let bSquare = Math.pow(Math.abs(start.longitude - longitude), 2);
        return Math.sqrt(aSquare + bSquare);
    }

    render() {
        return (
            // Waits to render input.
            this.state.wait ?
            <div className="add-stop-container">
                <div>Loading...</div>
                {setTimeout(() => {
                    this.setState({wait: false})
                }, 500)}
            </div>
            :
            <div className="add-stop-container">
                <AutoComplete
                    style={{width: '75%'}}
                    onPlaceSelected={this.pickStop}
                    types={['geocode']}
                />
                <button 
                    onClick={this.addStop} 
                    disabled={this.state.buttonDisable}
                >Add
                </button>
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
const mapDispatchToProps = {
    addStop
}

// const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(AddStop)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddStop));