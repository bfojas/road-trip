import React, { Component } from 'react';
import { connect } from 'react-redux';
import { GoogleApiWrapper } from "google-maps-react";
import { withRouter } from 'react-router-dom';
import MapRender from './mapRender/mapRender';
import RouteContainer from './RouteContainer/RouteContainer';
import StartTripModal from './StartTripModal/StartTripModal';
import TripSettingsModal from './RouteContainer/TripSettingsModal';
import './MapView.scss';

class MapView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startModal: true,
            tripSettingsModal: false,
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
        const {currentTrip} = this.props
        if (currentTrip && currentTrip.tripId) {
            this.setState({ startModal: false });
        } else {
            this.setState({ startModal: true });
        }
    }

    showModal = modal => {
        this.setState({ [modal]: true })
    }
 
    closeModal = modal => {
        this.setState({ [modal]: false });
    }

    toggleRouteContainer = () => {
        let routeContainerState = this.state.showRouteContainer;
        this.setState({ showRouteContainer: !routeContainerState });
    }


    render() {
        const { startModal, tripSettingsModal, showRouteContainer } = this.state;
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
                <TripSettingsModal
                    show={tripSettingsModal}
                    closeModal={this.closeModal}
                />
                <div className="map-container" style={{filter: blur}}>
                    <MapRender/>
                </div>
                <div className="route-container" style={{filter: blur, display: routeDisplay}} >
                    <RouteContainer 
                        show={showRouteContainer}
                        toggle={this.toggleRouteContainer}
                        showModal={this.showModal}
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

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MapView))
export default withRouter(connect(mapStateToProps)(GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(MapView)));