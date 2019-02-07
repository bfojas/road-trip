/*global google*/

import React, {Component} from 'react';
import './StartTripModal.scss';
import AutoComplete from 'react-google-autocomplete';
import { GoogleApiWrapper } from "google-maps-react";
import {connect} from 'react-redux'
import {updateStartEndData} from '../../../ducks/reducer'
import axios from 'axios'




class StartTripModal extends Component {
    constructor(props){
        super(props)
        this.state={
            originImage:'',
            originName: 'Where do we start?',
            destinationImage:'',
            destinationName: 'Where are we going?',
            // input: ""
            submitDisable: true
        }
    }

    originPicker = (location) => {
        const {formatted_address} = location;
        const {long_name} = location.address_components[0]
        const imageSet = location.photos
        ?location.photos[0].getUrl()
        :null
        const latSet = location.geometry.location.lat()
        const lngSet = location.geometry.location.lng()

        this.setState({originPick: {
            name: long_name,
            address: formatted_address,
            image: imageSet,
            latitude: latSet,
            longitude: lngSet
        }})
        const {originPick, destinationPick} = this.state
        if (originPick && destinationPick)
            {this.setState({submitDisable: false})}
    }

    destinationPicker = (location) => {
        console.log('location', location)
        const {formatted_address} = location;
        const {long_name} = location.address_components[0]
        const imageSet = location.photos
        ?location.photos[0].getUrl()
        :null
        const latSet = location.geometry.location.lat()
        const lngSet = location.geometry.location.lng()

        this.setState({destinationPick: {
            name: long_name,
            address: formatted_address,
            image: imageSet,
            latitude: latSet,
            longitude: lngSet
        }})
        const {originPick, destinationPick} = this.state
       
            if (originPick && destinationPick)
            {this.setState({submitDisable: false})}
    }

    submitTrip = () => {
        const {originPick, destinationPick, destinationName} = this.state
        console.log('picks',originPick, "dest", destinationPick, 'name', destinationName)
        let route = {origin: originPick, 
            destination: destinationPick,
            name: destinationName}
        axios.post('/map/start', route)
        this.props.updateStartEndData(
            route)
        this.props.closeModal()

    }


    handleChange = (e) => {
        this.setState({input: e})
    }
    render(){
        const {inputType, origin, destination, show} = this.props
        const {originPick, originImage, originName, destinationPick, destinationImage, destinationName} = this.state

        if(originPick && (originImage !== `url(${originPick.image})`))
        {this.setState({originImage: `url(${originPick.image})`})}
        if(originPick && (originName !== `${originPick.address}`))
        {this.setState({originName: `${originPick.address}`})}
        
        if(destinationPick && (destinationImage !== `url(${destinationPick.image})`))
        {this.setState({destinationImage: `url(${destinationPick.image})`})}
        if(destinationPick && (destinationName !== `${destinationPick.address}`))
        {this.setState({destinationName: `${destinationPick.address}`})}

        return show ? ( 
            <div className="fade-div">    
                <div className="start-trip-container" >
                    <div className="start-input">
                        <div className="origin-select"
                            style={{backgroundImage: this.state.originImage}}
                        >
                            <div className="trans-box">
                                <h1>{originName}</h1>
                                <AutoComplete
                                    style={{width: '75%'}}
                                    onPlaceSelected={this.originPicker}
                                    types={['geocode']}
                                />
                            </div>
                            
                        </div>
                        <div 
                            className="destination-select"
                            style={{backgroundImage: this.state.destinationImage}}
                        >
                            <div className="trans-box">
                                <h1>{destinationName}</h1>
                                <AutoComplete
                                    style={{width: '75%'}}
                                    onPlaceSelected={this.destinationPicker}
                                    types={['geocode']}
                                />
                            </div>
                        </div>
                        <div className="submitButton">
                            <button onClick={this.submitTrip} disabled={this.state.submitDisable}>Let's Go!</button>
                        </div>
                    </div>
                    {/* <div className="location-info">
                        <img src={origin && origin.photos[0].getUrl()}/>
                        <div className="input-destination">Destination: {destination && destination.address_components[0].long_name}</div>
                    </div> */}
                </div>
            </div>
        )
        : null
    }
}

const mapStateToProps = ()=> {
    
}
const mapDispatchToProps = {
    updateStartEndData
}

const wrappedMap = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(StartTripModal)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedMap)
