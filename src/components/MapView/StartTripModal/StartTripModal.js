/*global google*/

import React, { Component } from 'react';
import './StartTripModal.scss';
import AutoComplete from 'react-google-autocomplete';
import { GoogleApiWrapper } from "google-maps-react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { updateStartEndData, updateTripId } from '../../../ducks/reducer';
import axios from 'axios';

class StartTripModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            originImage:'',
            originName: 'Where do we start?',
            destinationImage:'',
            destinationName: 'Where are we going?',
            // input: ""
            submitDisable: true
        };
    }

    componentDidMount = () => {
        console.log('refs', this)
        // this.refs.destination.ref.input.current.autocomplete.setFields(['formatted_address', 'name', 'geometry', 'photos'])
      }

    // sets origin in state with info
    originPicker = (location) => {
        console.log('origin', location)
        const {formatted_address} = location;
        const {name} = location;
        const imageSet = location.photos
        ? location.photos[0].getUrl()
        : null;
        const latSet = location.geometry.location.lat()
        const lngSet = location.geometry.location.lng()

        this.setState({originPick: {
            name: name,
            address: formatted_address,
            image: imageSet,
            latitude: latSet,
            longitude: lngSet
        }})
        const {originPick, originImage, originName, destinationPick} = this.state

        // update modal pic/name        
        if(originPick && (originImage !== `url(${originPick.image})`))
        {this.setState({originImage: `url(${originPick.image})`})}
        if(originPick && (originName !== `${originPick.address}`))
        {this.setState({originName: `${originPick.address}`})}

        // if origin & desination are picked, enables submit button        
        if (originPick && destinationPick)
            {this.setState({submitDisable: false})}
    }

    destinationPicker = (location) => {
        console.log('destination', location)
// sets origin in state with info
        const {formatted_address} = location;
        const {name} = location;
        const imageSet = location.photos
        ? location.photos[0].getUrl()
        : null;
        const latSet = location.geometry.location.lat()
        const lngSet = location.geometry.location.lng()

        this.setState({destinationPick: {
            name: name,
            address: formatted_address,
            image: imageSet,
            latitude: latSet,
            longitude: lngSet
        }})
        const {originPick, destinationImage, destinationName, destinationPick} = this.state

// update modal pic/name        
        if(destinationPick && (destinationImage !== `url(${destinationPick.image})`))
        {this.setState({destinationImage: `url(${destinationPick.image})`})}
        if(destinationPick && (destinationName !== `${destinationPick.address}`))
        {this.setState({destinationName: `${destinationPick.address}`})}
       
// if origin & desination are picked, enables submit button        
        if (originPick && destinationPick)
            {this.setState({submitDisable: false})}
    }

    submitTrip = () => {
        const {originPick, destinationPick, destinationName} = this.state
        
// sends trip data to db        
        axios.post('/map/start', 
            {origin: originPick, 
            destination: destinationPick,
            name: destinationName,
            userId: this.props.user.id,
            timeStamp : Date.now()})
// sends trip id to redux props
            .then(res=>{
                console.log('tripId', res)
                this.props.updateTripId(res.data[0].id)
            })
            .catch(error => console.log('------submit trip', error))

// sends trip data to redux props
        this.props.updateStartEndData(
            {origin: originPick, 
            destination: destinationPick,
            name: destinationName})

// close modal
        this.props.closeModal()

    }


    handleChange = (e) => {
        this.setState({input: e})
    }
    render(){
        const {show} = this.props
        const {originName, destinationName} = this.state
        

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
                                    ref='destination'
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
                </div>
            </div>
        )
        : null
    }
}

const mapStateToProps = (state)=> {
    return{
        user: state.user,
        tripId: state.tripId

    }
}
const mapDispatchToProps = {
    updateStartEndData,
    updateTripId
}

// const wrappedModal = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(StartTripModal)
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StartTripModal))
