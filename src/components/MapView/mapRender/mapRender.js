/*global google*/

import React,  {Component} from 'react';
import  { compose, withProps, lifecycle } from 'recompose'
import { GoogleApiWrapper } from "google-maps-react";
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'
import { connect } from 'react-redux'



class MapRender extends Component{

    constructor(props){
        super(props)
        this.state = {
          rerender : ""
        }
      }

    componentDidUpdate(prevProps) {
      if(prevProps.destination !== this.props.destination)
      {this.setState({rerender: "hi"})}
      // :null

    }

    render(){

// ------ map styles
        // let mapStyle = []      

// ------ default map start
        let originLongLat = '42.123123, -80.123123'
        let destinationLongLat = '33.448377, -112.074037'
        const {tripOrigin, tripDestination, tripWaypoints} = this.props
        console.log('waypoints', tripWaypoints)

// ------ sets map based on props
      if (tripDestination)
      {console.log('origin', tripOrigin)
        originLongLat = `${tripOrigin.latitude},${tripOrigin.longitude}`
      destinationLongLat = `${tripDestination.latitude},${tripDestination.longitude}`}

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
              googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}`,
              loadingElement: <div className="test" style={{ height: `400px` }} />,
              containerElement: <div style={{ width: `100%` }} />,
              mapElement: <div style={{height: `calc(100vh - 75px)`, width: `100vw` }}  />,
            }),
            withScriptjs,
            withGoogleMap,
            lifecycle({
              componentDidMount() { 
                // setTimeout(()=>{
                  console.log('route', renderRoute)
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
              // },5000)
              }
            })
          )(props =>
            <GoogleMap
              defaultZoom={50}
              // controlPosition={google.maps.ControlPosition.TOP_LEFT}
            //   defaultOptions={{styles : mapStyle}}
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
  tripOrigin: state.tripOrigin, 
  tripDestination:state.tripDestination, 
  tripWaypoints: state.tripWaypoints
  }
}

const wrappedRender = connect(mapStateToProps)(MapRender)
export default GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(wrappedRender)
