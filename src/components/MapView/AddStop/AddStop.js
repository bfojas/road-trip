import React, {Component} from 'react';
import AutoComplete from 'react-google-autocomplete';
import { GoogleApiWrapper } from "google-maps-react";
import {connect} from 'react-redux'
import {addStop} from '../../../ducks/reducer'
import axios from 'axios';


class AddStop extends Component {
    constructor (props) {
        super(props)
        this.state = {
            name: "",
            address: "",
            image: "",
            latitude: "",
            longitude: "",
            wait: true
        }
    }


    pickStop = (location) =>{
// ------ set location to state
        console.log('location', location)
        const {formatted_address} = location;
        const {long_name} = location.address_components[0]
        const imageSet = location.photos
        ?location.photos[0].getUrl()
        :null
        const latSet = location.geometry.location.lat()
        const lngSet = location.geometry.location.lng()

        this.setState({
            name: long_name,
            address: formatted_address,
            image: imageSet,
            latitude: latSet,
            longitude: lngSet
        })
    }

    addStop = () =>{
        const {tripId} = this.props;
        const { name, address, image, latitude, longitude} = this.state

// ------create new waypoint array       
        let newList = this.props.tripWaypoints.slice()
        newList.push({name, address, image, latitude, longitude})
// ------ add stop to database        
        axios.put('/map/add', {tripId, stop:{
            name, address, image, latitude, longitude
            }})
// ------ send new waypoint array to props        
        this.props.addStop(newList)
    }

    render (){
        return (

// ------ waits to render input
            this.state.wait
            ?<div>
                <div>Loading...</div>
                {setTimeout(() => {
                    this.setState({wait: false})
                }, 500)}
            </div>
            :
            <div>
                <AutoComplete
                style={{width: '75%'}}
                onPlaceSelected={this.pickStop}
                types={['geocode']}
                />
                <button onClick={this.addStop}>Add</button>

            </div>
        )
    }


}


const mapStateToProps = (state)=> {
    return{
        user: state.user,
        tripOrigin: state.tripOrigin,
        tripDestination: state.tripDestination,
        tripWaypoints: state.tripWaypoints,
        tripId: state.tripId

    }
}
const mapDispatchToProps = {
    addStop
}

const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(AddStop)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedRoute)