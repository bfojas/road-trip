/*global google*/

import React,  {Component} from 'react';
import  { compose, withProps, lifecycle } from 'recompose'
import { GoogleApiWrapper } from "google-maps-react";
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'


class MapRender extends Component{

    constructor(props){
        super(props)
        // this.state ={
        //     origin:'',
        //     destination:'',
        //     waypoints: ''
        // }
      }

    render(){
        // const mapStyle =[]
        let originLongLat = '42.123123, -80.123123'
        let destinationLongLat = '42.123123, -80.123123'
        const {origin, destination} = this.props
        

        if (destination)
        {originLongLat = `${origin.geometry.location.lat()},${origin.geometry.location.lng()}`
        destinationLongLat = `${destination.geometry.location.lat()},${destination.geometry.location.lng()}`}
        console.log('map props', this.props)
        const DirectionsComponent = compose(
            withProps({
              googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}`,
              loadingElement: <div style={{ height: `400px` }} />,
              containerElement: <div style={{ width: `100%` }} />,
              mapElement: <div style={{height: `calc(100vh - 75px)`, width: `100vw` }}  />,
            }),
            withScriptjs,
            withGoogleMap,
            lifecycle({
              componentDidMount() { 
                setTimeout(()=>{
                const DirectionsService = new google.maps.DirectionsService();
                DirectionsService.route({
                  origin: originLongLat,
                  destination: destinationLongLat,
                  // waypoints: [{location: '42.123123, -80.123123', stopover: true},
                  //   {location: '44.000000, -81.000000', stopover: true}],
                  travelMode: google.maps.TravelMode.DRIVING,
                }, (result, status) => {
                  if (status === google.maps.DirectionsStatus.OK) {
      this.setState({
                      directions: {...result},
                      markers: true
                    })
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                })},300)
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

export default GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_MAP_KEY})(MapRender)
