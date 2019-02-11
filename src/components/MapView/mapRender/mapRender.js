/*global google*/

import React,  {Component} from 'react';
import  { compose, withProps, lifecycle } from 'recompose'
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'
import { connect } from 'react-redux'
import { withRouter} from 'react-router-dom';



class MapRender extends Component{

    render(){

// ------ map styles
        // let mapStyle = []      

// ------ default map start
        let originLongLat, destinationLongLat
        const {tripOrigin, tripDestination} = this.props.currentTrip
        const {tripWaypoints} = this.props

// ------ sets map based on props
      if (tripDestination){
        originLongLat = `${tripOrigin.latitude},${tripOrigin.longitude}`
        destinationLongLat = `${tripDestination.latitude},${tripDestination.longitude}`
      } else {
        originLongLat = '42.123123, -80.123123'
        destinationLongLat = '33.448377, -112.074037'
      }
      // ------ for rendering default map without waypoints
      let renderWaypoints = []
      let renderRoute={
        origin: originLongLat,
        destination: destinationLongLat,
        travelMode: google.maps.TravelMode.DRIVING,
      }


// ------ renders waypoints when they are added
      if(tripWaypoints.length){
        renderWaypoints = tripWaypoints.map(val=>{
            return {location: `${val.latitude}, ${val.longitude}`, stopover: true}
          })
        renderRoute = {
          origin: originLongLat,
          destination: destinationLongLat,
          waypoints: renderWaypoints,
          travelMode: google.maps.TravelMode.DRIVING,
        }
      }

        const DirectionsComponent = compose(
            withProps({
              googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAP_KEY}`,
              loadingElement: <div className="test" style={{ height: `400px` }} />,
              containerElement: <div style={{ width: `100%` }} />,
              mapElement: <div style={{height: `calc(100vh - 75px)`, width: `100vw` }}  />,
            }),
            withScriptjs,
            withGoogleMap,
            lifecycle({
              componentDidMount() { 
                setTimeout(()=>{
                const DirectionsService = new google.maps.DirectionsService();
                DirectionsService.route(renderRoute, 
                  (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
                    this.setState({
                      directions: {...result},
                      markers: true
                    })
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                })
              },1000)
              }
            })
          )(props =>
            <GoogleMap
              defaultZoom={50}
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
              {props.directions && <DirectionsRenderer directions={props.directions} suppressMarkers={props.markers}/>}
              
            </GoogleMap>
            
          );
      return (
              <DirectionsComponent
              />
          )
        }
      
}


const mapStateToProps = (state) => {
  return{
    currentTrip: state.currentTrip,
    tripWaypoints: state.currentTrip.tripWaypoints
  }
}

// const wrappedRender = connect(mapStateToProps)(MapRender)
// export default GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(wrappedRender)

export default withRouter(connect(mapStateToProps)(MapRender))