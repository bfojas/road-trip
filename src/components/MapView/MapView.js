/*global google*/
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleApiWrapper } from "google-maps-react";
import { updateStartEndData } from '../../ducks/reducer';
import { withRouter } from 'react-router-dom';
import MapRender from './mapRender/mapRender';
import RouteContainer from './RouteContainer/RouteContainer';
import StartTripModal from './StartTripModal/StartTripModal';
import './MapView.scss';

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startModal: true,
            showRouteContainer: true
        }
    }

    componentDidMount = () => {
        this.tripCheck();
    }

    componentDidUpdate = (prevProps) =>{
        if (prevProps !== this.props){
            this.tripCheck();
        }
    }

    tripCheck = () => {
        //Hide StartTripModal if current trip exists, otherwise show.
        if (this.props.currentTrip.tripId) {
            this.setState({ startModal: false });
        } else {
            this.setState({ startModal: true });
        }
    }

    closeModal = () => {
        this.setState({ startModal: false });
    }

    toggleRouteContainer = () => {
        let routeContainerState = this.state.showRouteContainer;
        this.setState({ showRouteContainer: !routeContainerState });
    }

    


    render() {
        const {startModal, showRouteContainer} = this.state;
        if (startModal) {
            var blur = 'blur(1px)'
            var routeDisplay = 'none'
        } else {
            blur = 'none';
            routeDisplay = 'flex'
        };
        return(
            <div className="map-view-container">
                <StartTripModal 
                    show={startModal}
                    closeModal={this.closeModal}
                />
                <div className="map-container" style={{filter: blur}}>
                    <MapRender/>
                </div>
                <div className="route-container" style={{filter: blur, display: routeDisplay}} >
                    <RouteContainer 
                        show={showRouteContainer}
                        toggle={this.toggleRouteContainer}
                    />
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
};

const mapDispatchToProps = {
    updateStartEndData
};
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapView))
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(MapView)));