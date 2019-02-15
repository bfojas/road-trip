/*global google*/

import React, { Component } from "react";
// Recompose = React utility for function components and HOCs.
import  { compose, withProps, lifecycle } from "recompose";
import { GoogleApiWrapper } from "google-maps-react";
import { withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer } from "react-google-maps";
import { connect } from "react-redux";
import { withRouter} from "react-router-dom";

class MapRender extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        // let mapStyle = [];      
        let originLongLat, destinationLongLat;
        const { tripOrigin, tripDestination } = this.props.currentTrip;
        const {tripWaypoints} = this.props;
		// If destination exists for trip, sets map origin and destination coordinates based 
		// off current trip values in Redux, otherwise sets default coordinate values.
		if (tripDestination) {
			originLongLat = `${tripOrigin.latitude}, ${tripOrigin.longitude}`;
			destinationLongLat = `${tripDestination.latitude}, ${tripDestination.longitude}`;
		} else {
			originLongLat = '42.123123, -80.123123';
			destinationLongLat = '33.448377, -112.074037';
		}
		// For rendering default map without waypoints; intializes empty renderWaypoints array
		// and renderRoute object with origin and destination info defined above.
		let renderWaypoints = [];
		let renderRoute = {
			origin: originLongLat,
			destination: destinationLongLat,
			travelMode: google.maps.TravelMode.DRIVING
		};
		// Updates renderWaypoints array with Redux values + adds waypoints to renderRoute object.
		if (tripWaypoints.length) {
			renderWaypoints = tripWaypoints.map(val => {
				return { location: `${val.latitude}, ${val.longitude}`, stopover: true };
			});
			renderRoute = {
				origin: originLongLat,
				destination: destinationLongLat,
				waypoints: renderWaypoints,
				travelMode: google.maps.TravelMode.DRIVING,
			};
		}

		// Compose new component using recompose React utility, HOCs/services from react-google-maps 
		// and above renderRoute object.
        const DirectionsComponent = compose(
            withProps({
				googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,
				loadingElement: <div className="test" style={{ height: `400px` }} />,
				containerElement: <div style={{ width: `100%` }} />,
				mapElement: <div style={{height: `calc(100vh - 75px)`, width: `100vw` }}  />,
			}),
			withRouter,
            withScriptjs,
            withGoogleMap,
            lifecycle({
				componentDidMount() { 
					setTimeout(() => {
						const DirectionsService = new google.maps.DirectionsService();
						DirectionsService.route(renderRoute, (result, status) => {
							if (status === google.maps.DirectionsStatus.OK) {
								this.setState({
									directions: {...result},
									markers: true
								})
							} else {this.props.history.push('/')
								// console.error(`error fetching directions ${result}`);
							}
						})
					}, 1000);
				}
            })
        )(props =>
            <GoogleMap
			  defaultZoom={50}
			  onClick={e=>console.log('click', e)}
              // controlPosition={google.maps.ControlPosition.TOP_LEFT}
              defaultOptions={{
                // styles : mapStyle,
                streetViewControl: false,
                scaleControl: false,
                mapTypeControl: false,
                panControl: false,
                zoomControl: false,
                rotateControl: false,
                fullscreenControl: false
              }}
            >
				  {	props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers}/> }  
            </GoogleMap>
            
        );
	  
		return <DirectionsComponent />;
    }
      
}


const mapStateToProps = (state) => {
  return{
	user: state.user,
    currentTrip: state.currentTrip,
    tripWaypoints: state.currentTrip.tripWaypoints
  }
}

export default withRouter(connect(mapStateToProps)(MapRender));