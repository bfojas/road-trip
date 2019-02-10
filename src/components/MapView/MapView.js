import React, {Component} from 'react';
import MapRender from './mapRender/mapRender'
import RouteContainer from './RouteContainer/RouteContainer'
import './MapView.scss'
import StartTripModal from './StartTripModal/StartTripModal';
import {connect} from 'react-redux'
import { GoogleApiWrapper } from "google-maps-react";
import {updateStartEndData} from '../../ducks/reducer'
import {withRouter} from 'react-router-dom';


class MapView extends Component {
    constructor(props){
        super(props)
        this.state = {
            startModal: true,
        }

    }

    componentDidMount = () => {
        this.tripCheck()
    }

    tripCheck = () => {
        console.log('trip id', this.props.tripId)
        if(this.props.tripId !== 0)
        {this.setState({startModal: false})}
    }

    closeModal = () => {
        this.setState({startModal: false})
    }


    render(){
        const {tripOrigin, tripDestination, tripName, tripWaypoints, updateStartEndData} = this.props
        const {startModal} = this.state
        return(
            <div className="map-view-container">
                <StartTripModal 
                    show= {startModal}
                    origin={tripOrigin} 
                    destination={tripDestination}
                    closeModal={this.closeModal}
                />
                <div className="map-container">
                    <MapRender
                    // origin={tripOrigin} 
                    // destination={tripDestination}
                    // waypoints={tripWaypoints}
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

const mapStateToProps = (state) => {
    return {user: state.user,
    tripOrigin: state.tripOrigin,
    tripDestination: state.tripDestination,
    tripName: state.tripName,
    tripWaypoints: state.tripWaypoints,
    tripId: state.tripId
    }
}

const mapDispatchToProps = {
    updateStartEndData
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(MapView)))