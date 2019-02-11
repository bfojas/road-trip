import React, {Component} from 'react';
import { GoogleApiWrapper } from "google-maps-react";
import {connect} from 'react-redux'
import {DragDropContainer, DropTarget} from 'react-drag-drop-container';
import AddStop from '../AddStop/AddStop'
import { updateTripInfo } from '../../../ducks/reducer'
import './RouteContainer.scss'
import axios from 'axios';

class RouteContainer extends Component {
    constructor(props){
        super(props)
    }

    drop = (drag, drop) => {
        const {updateTripInfo} = this.props;
        const {tripWaypoints, tripOrigin, tripDestination, tripName, tripId} = this.props.currentTrip
        let newArr =tripWaypoints.slice();
        let element = newArr.splice(drag, 1);
        newArr.splice(+drop, 0 , element[0])
        updateTripInfo({tripWaypoints: newArr, tripOrigin, tripDestination, tripName, tripId})
        let wayPointIndexArray = tripWaypoints.map(val=> val.id)
        axios.post('/map/stopOrder', {wayPointIndexArray, tripId})
            .catch(error => console.log('--- change route error', error))
    }

    render(){
        const {tripWaypoints, tripOrigin, tripDestination, tripName, tripId} = this.props.currentTrip
        let mappedWaypoints = tripWaypoints.map((val,i) =>{
            return(
                <DragDropContainer dragData={{drag:i}}>
                    <DropTarget onHit={e=>this.drop(e.dragData.drag, e.target.id)}>
                        <div key={val.name} id={i} className="stop">
                            <h3>{val.name}</h3>
                            <div className="image-div" style={{backgroundImage: `url(${val.image})`}}></div>
                        </div>
                    </DropTarget>
                </DragDropContainer>
            )
        })
        return(
            tripDestination
            ?
            <div className="route-holder">
                <AddStop/>
                <div className="stop-container">
                    <div key={tripOrigin.name} className="stop">
                        <h3>{tripOrigin.name}</h3>
                        <div className="image-div" style={{backgroundImage: `url(${tripOrigin.image})`}}></div>
                    </div>
                    {mappedWaypoints}
                    <div key={tripDestination.name} className="stop">
                        <h3>{tripDestination.name}</h3>
                        <div className="image-div" style={{backgroundImage: `url(${tripDestination.image})`}}></div>
                    </div>
                </div>
            </div>
            :
            <div>loading...</div>

        )
    }
}

const mapStateToProps = (state)=> {
    return{
        user: state.user,
        currentTrip: state.currentTrip,
        tripWaypoints: state.currentTrip.tripWaypoints
    }
}
const mapDispatchToProps = {
    updateTripInfo
}

const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(RouteContainer)
export default connect(mapStateToProps, mapDispatchToProps)(wrappedRoute)