import React, {Component} from 'react';
import MapRender from './mapRender/mapRender'
import RouteContainer from './RouteContainer/RouteContainer'
import './MapView.scss'
import StartTripModal from './StartTripModal/StartTripModal';


class MapView extends Component {
    constructor(props){
        super(props)
        this.state = {
            startModal: true,
            startModalStep: "origin",
            tripOrigin: null,
            tripDestination: null,
            tripName: '',
            tripWaypoints: [],
            inputType: "autoComplete",
            instruction: "Where do we start?"
        }

    }

    tripSet = (location) =>{
        const {tripOrigin} = this.state
        !tripOrigin
        ? this.setState({
            tripOrigin: location, 
            instruction: "Where to?"
        })
        : this.setState({
            tripDestination: location,
            instruction: "Name your trip:"})
    }

    nameSet = (tripName) => {
        this.setState({tripName})
        this.setState({startModal: false})
    }

    render(){
        const {startModal, tripOrigin, tripDestination, tripName, instruction, inputType} = this.state
        return(
            <div className="map-view-container">
                <StartTripModal 
                    show= {startModal}
                    origin={tripOrigin} 
                    destination={tripDestination}
                    tripSet={this.tripSet}
                    nameSet={this.nameSet}
                    instruction={instruction}
                    inputType={inputType}
                />
                <div className="map-container">
                    <MapRender
                    origin={tripOrigin} 
                    destination={tripDestination}
                    />
                </div>
                <div className="route-container">
                    <RouteContainer
                    origin={tripOrigin} 
                    destination={tripDestination}
                    tripName={tripName}
                    />
                </div>
            </div>
        )
    }
}

export default MapView