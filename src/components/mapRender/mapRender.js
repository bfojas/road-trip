/*global google*/

import React,  {Component} from 'react';
import  { compose, withProps, lifecycle } from 'recompose'
import {withScriptjs, withGoogleMap, GoogleMap, DirectionsRenderer} from 'react-google-maps'


class MapRender extends Component{

    constructor(props){
        super(props)
        this.state ={
            origin:'',
            destination:'',
            waypoints: ''
        }
      }

    render(){
        // const mapStyle =[]
        const DirectionsComponent = compose(
            withProps({
              googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_KEY}`,
              loadingElement: <div style={{ height: `400px` }} />,
              containerElement: <div style={{ width: `100%` }} />,
              mapElement: <div style={{height: `600px`, width: `600px` }}  />,
            }),
            withScriptjs,
            withGoogleMap,
            lifecycle({
              componentDidMount() { 
                //   console.log('map', google.maps)
                const DirectionsService = new google.maps.DirectionsService();
                DirectionsService.route({
                  origin: new google.maps.LatLng(41.8507300, -87.6512600),
                  destination: '41.8525800, -87.6514100',
                  waypoints: [{location: '42.123123, -80.123123', stopover: true},
                    {location: '44.000000, -81.000000', stopover: true}],
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
                });
              }
            })
          )(props =>
            <GoogleMap
              defaultZoom={3}
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

export default MapRender