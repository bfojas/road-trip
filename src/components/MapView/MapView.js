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

    componentDidUpdate = (prevProps) =>{
        if (prevProps !== this.props){
            this.tripCheck()
        }
    }

    tripCheck = () => {
        if(this.props.currentTrip.tripId !== 0)
        {this.setState({startModal: false})}
        else {this.setState({startModal: true})}
    }

    closeModal = () => {
        this.setState({startModal: false})
    }


    render(){
        const {startModal} = this.state
        console.log('map hit')
        // if (startModal){
        //     var blur = 'blur(1px)'
        // } else {
        //     blur = 'none'
        // }
        return(
            <div className="map-view-container">
                <StartTripModal 
                    show= {startModal}
                    closeModal={this.closeModal}
                />
                <div className="map-container" 
                // style={{filter: blur}}
                >
                    <MapRender/>
                </div>
                <div className="route-holder" 
                // style={{filter: blur}}
                >
                    <RouteContainer
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {user: state.user,
    currentTrip: state.currentTrip
    }
}

const mapDispatchToProps = {
    updateStartEndData
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(MapView)))