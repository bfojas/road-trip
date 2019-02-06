/*global google*/

import React, {Component} from 'react';
import './StartTripModal.scss';
import AutoComplete from 'react-google-autocomplete';
import { GoogleApiWrapper } from "google-maps-react";




class StartTripModal extends Component {
    constructor(props){
        super(props)
        this.state={
            
            input: ""
        }
    }

    componentDidMount= async ()=> {
            var placeInput = await (<AutoComplete
            style={{width: '90%'}}
            onPlaceSelected={this.props.tripSet}
            types={['geocode']}
        />)
    }

    handleChange = (e) => {
        this.setState({input: e})
    }

    render(){
        // let placeInput
        const {inputType, instruction, origin, destination, show} = this.props
        const {input} = this.state
        console.log('instruction', inputType)
        return show ? ( 
            <div className="start-trip-container" >
                <header>
                    <h2>Welcome!</h2>
                    {/* <h3>{instruction}</h3> */}
                </header>
                <div className="start-input">
                    {inputType === 'autoComplete'
                    ?<div>
                        <AutoComplete
                            style={{width: '90%'}}
                            onPlaceSelected={this.props.tripSet}
                            types={['geocode']}
                        />
                    </div>
                    :
                    <input 
                        placeholder="test"
                        value={input} 
                        onKeyDown={e=>{if(e.keyCode===13) {this.props.nameSet(input)}}}
                        onChange={e=>this.handleChange(e.target.value)}
                    />
                }
                </div>
                
                <div className="input-origin">Origin: {origin && origin.address_components[0].long_name}</div>
                <div className="input-destination">Destination: {destination && destination.address_components[0].long_name}</div>

            </div>
        )
        : null
    }
}
export default GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(StartTripModal)
