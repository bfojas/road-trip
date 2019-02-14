import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import AutoComplete from "react-google-autocomplete";
import { addStop, updateTripInfo } from "../../../ducks/reducer";
import './AddStop.scss';

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

    addStop = () =>{
        const {tripId, tripOrigin, tripWaypoints} = this.props.currentTrip;
        const { name, address, image, latitude, longitude} = this.state
        let start_distance = Number(this.getDistance(tripOrigin, latitude, longitude).toFixed(5))
        // ------ add stop to database
        axios.post('/api/add-stop', {tripId, start_distance, stop:{
            name, address, image, latitude, longitude
            }})
            .then(newStopId=>{
// ------create new waypoint array     
                let newList = tripWaypoints.slice();
                let newStop = {name, address, image, latitude, longitude, start_distance, id: newStopId.data.id};
                let waypointIndexArray = [];
    // ------ places new stops based on distance from start point
        //------ function finds where to insert stop into array
                let insertInOrder = (index) =>{

                    var newIndex;
                    if (index === newList.length){
                        newIndex = index
                    }
                    else if (newList[index].start_distance < start_distance){

                        return insertInOrder(index + 1);
                    } else {
                    newIndex = index
                    }
                    return newIndex;
                }
        //------ places stop into array
                if (newList.length){
                    let insertIndex = insertInOrder(0);

                    newList.splice(insertIndex, 0 , newStop);
                }
                    else{
                    newList.push(newStop)
                }

//------ makes array of stop order by stop id                
                waypointIndexArray = newList.map (val=>{
                    return val.id
                })

// ------ send new waypoint array to props 
                const {currentTrip} = this.props;
                currentTrip.tripWaypoints = newList   
                this.props.updateTripInfo(currentTrip)
            
//------ send stop order array to session/db
                axios.post('/api/stopOrder', {waypointIndexArray, tripId, newTrip: currentTrip})
            
            })
    }

    //Calculates distance from origin location for new stop.
    getDistance = (start, latitude, longitude) => {
        let aSquare = Math.pow(Math.abs(start.latitude - latitude), 2);
        let bSquare = Math.pow(Math.abs(start.longitude - longitude), 2);
        return Math.sqrt(aSquare + bSquare);
    }

    render () {
        let imageUrl;
        let displayName = "";
        if (this.props.currentTrip.tripDestination){
            imageUrl = `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${this.props.currentTrip.featuredImage})`
            displayName = this.props.currentTrip.tripName
        };

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
            <div className="add-stop-container" style={{backgroundImage: imageUrl}}>
                <i onClick={() => this.props.showModal("tripSettingsModal")} className="fas fa-cog"></i>
                <h1>{displayName}</h1>
                <div className="search-component">
                <AutoComplete
                    style={{width: '75%'}}
                    onPlaceSelected={this.pickStop}
                    types={['geocode']}
                    componentRestrictions={{country: ["us", "ca"]}}
                />
                <button 
                    onClick={this.addStop} 
                    disabled={this.state.buttonDisable}>
                Add
                </button>
                </div>
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
    addStop,
    updateTripInfo
}   

// const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(AddStop)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddStop));