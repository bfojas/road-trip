import React, {Component} from "react";
import { GoogleApiWrapper } from "google-maps-react";
import { connect } from "react-redux";
import { DragDropContainer, DropTarget } from "react-drag-drop-container";
import { slide as Menu } from "react-burger-menu";
import AddStop from "../AddStop/AddStop";
import { updateTripInfo } from "../../../ducks/reducer";
import "./RouteContainer.scss";
import axios from "axios";

class RouteContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            showModal: false,
            modalInfo: null
        }
    }

    drop = (drag, drop) => {
        const {updateTripInfo} = this.props;
        const {tripWaypoints, tripOrigin, tripDestination, tripName, tripId} = this.props.currentTrip
        let newArr = tripWaypoints.slice();
        let element = newArr.splice(drag, 1);
        newArr.splice(+drop, 0 , element[0])
        updateTripInfo({tripWaypoints: newArr, tripOrigin, tripDestination, tripName, tripId})
        let wayPointIndexArray = tripWaypoints.map(val=> val.id)
        axios.post('/api/stopOrder', {wayPointIndexArray, tripId})
            .catch(error => console.log('--- change route error', error))
    }

    showModal = (stop) => {
        this.setState=({
            showModal: true,
            modalInfo: stop
        })
    }

    hideModal = () => {
        this.setState=({
            showModal: false
        })

    }

    render() {
        const {tripWaypoints, tripOrigin, tripDestination} = this.props.currentTrip
        const {showModal, modalInfo} = this.state
        let mappedWaypoints = tripWaypoints.map((val,i) =>{
            return(
                <div className="stop">
                    <DragDropContainer dragData={{drag:i}} onClick={this.showModal(val)}>
                        <DropTarget onHit={e=>this.drop(e.dragData.drag, e.target.id)}>
                            <div className="stop-drag" id={i}>
                                Drag Me
                            </div>
                        </DropTarget>
                    </DragDropContainer>
                    <div key={val.name} className="stop-info" onClick={() => this.showModal(val)}>
                        <h3>{val.name}</h3>
                        <div className="image-div" style={{backgroundImage: `url(${val.image})`}}></div>
                    </div>
                </div>
            )
        })

        return (
            tripDestination ?
                <Menu right isOpen={show}>
                    <div className="route-holder">
                        <div className="route-tab"></div>
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
                        <StopModal show={showModal} stopInfo={modalInfo} hide={this.hideModal}/>
                    </div>
                </Menu>
            : null
        );
    }

}

const mapStateToProps = state => {
    return {
        user: state.user,
        currentTrip: state.currentTrip,
        tripWaypoints: state.currentTrip.tripWaypoints
    }
}

const mapDispatchToProps = {
    updateTripInfo
}

const wrappedRoute = GoogleApiWrapper({apiKey:process.env.REACT_APP_GOOGLE_KEY})(RouteContainer);
export default connect(mapStateToProps, mapDispatchToProps)(wrappedRoute);